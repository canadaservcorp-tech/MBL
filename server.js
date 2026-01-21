import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const BOOTSTRAP_KEY = process.env.BOOTSTRAP_KEY || 'bootstrap-secret-key';

// Database setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'maintenance.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database with schema
const schemaPath = path.join(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('✅ Database schema initialized');
}

// Email transporter (optional)
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log('✅ Email transporter configured');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.CLIENT_URLS?.split(',') || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============ AUTH ROUTES ============

// Bootstrap first admin
app.post('/api/auth/bootstrap', (req, res) => {
  const bootstrapKey = req.headers['x-bootstrap-key'];
  if (bootstrapKey !== BOOTSTRAP_KEY) {
    return res.status(403).json({ error: 'Invalid bootstrap key' });
  }

  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword, phone || null, 'admin');
    
    res.json({ message: 'Admin user created', userId: result.lastInsertRowid });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ USER ROUTES ============

// List all users (admin only)
app.get('/api/users', authMiddleware, adminOnly, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY name').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (admin only)
app.post('/api/users', authMiddleware, adminOnly, (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword, phone || null, role || 'staff');
    res.json({ message: 'User created', userId: result.lastInsertRowid });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Reset user password (admin only)
app.post('/api/users/reset-password', authMiddleware, adminOnly, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?'
    );
    const result = stmt.run(hashedPassword, email);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ APARTMENT ROUTES ============

app.get('/api/apartments', authMiddleware, (req, res) => {
  try {
    const apartments = db.prepare('SELECT * FROM apartments ORDER BY area_type, floor, unit_number').all();
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CATEGORY ROUTES ============

app.get('/api/categories', authMiddleware, (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CONTRACTOR ROUTES ============

app.get('/api/contractors', authMiddleware, (req, res) => {
  try {
    const contractors = db.prepare('SELECT * FROM contractors ORDER BY name').all();
    res.json(contractors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contractors', authMiddleware, adminOnly, (req, res) => {
  const { name, company, email, phone, specialty, rating, notes } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO contractors (name, company, email, phone, specialty, rating, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, company || null, email || null, phone, specialty || null, rating || 0, notes || null);
    res.json({ message: 'Contractor created', contractorId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contractors/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, company, email, phone, specialty, rating, notes } = req.body;
  
  try {
    const stmt = db.prepare(
      'UPDATE contractors SET name = ?, company = ?, email = ?, phone = ?, specialty = ?, rating = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    stmt.run(name, company, email, phone, specialty, rating, notes, req.params.id);
    res.json({ message: 'Contractor updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ TASK ROUTES ============

app.get('/api/tasks', authMiddleware, (req, res) => {
  try {
    const tasks = db.prepare(`
      SELECT 
        t.*,
        c.name as category_name,
        a.unit_number as apartment_unit,
        u.name as assigned_to_name,
        ct.name as contractor_name,
        cr.name as created_by_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN apartments a ON t.apartment_id = a.id
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN contractors ct ON t.contractor_id = ct.id
      LEFT JOIN users cr ON t.created_by = cr.id
      ORDER BY t.due_date DESC, t.priority DESC
    `).all();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', authMiddleware, (req, res) => {
  const {
    title, description, category_id, apartment_id, assigned_to,
    contractor_id, status, priority, task_type, due_date,
    estimated_cost, remarks
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO tasks (
        title, description, category_id, apartment_id, assigned_to,
        contractor_id, status, priority, task_type, due_date,
        estimated_cost, remarks, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title, description || null, category_id || null, apartment_id || null,
      assigned_to || null, contractor_id || null, status || 'pending',
      priority || 'medium', task_type || 'reactive', due_date || null,
      estimated_cost || 0, remarks || null, req.user.id
    );
    res.json({ message: 'Task created', taskId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const {
    title, description, category_id, apartment_id, assigned_to,
    contractor_id, status, priority, due_date, completed_date,
    estimated_cost, actual_cost, remarks
  } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE tasks SET
        title = ?, description = ?, category_id = ?, apartment_id = ?,
        assigned_to = ?, contractor_id = ?, status = ?, priority = ?,
        due_date = ?, completed_date = ?, estimated_cost = ?,
        actual_cost = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      title, description, category_id, apartment_id, assigned_to,
      contractor_id, status, priority, due_date, completed_date,
      estimated_cost, actual_cost, remarks, req.params.id
    );
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PREVENTIVE SCHEDULES ============

app.get('/api/preventive', authMiddleware, (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        a.unit_number as apartment_unit,
        u.name as assigned_to_name
      FROM preventive_schedules p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN apartments a ON p.apartment_id = a.id
      LEFT JOIN users u ON p.assigned_to = u.id
      WHERE p.active = 1
      ORDER BY p.next_due_date
    `).all();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/preventive', authMiddleware, (req, res) => {
  const {
    title, description, category_id, apartment_id,
    frequency, next_due_date, assigned_to
  } = req.body;

  if (!title || !frequency || !next_due_date) {
    return res.status(400).json({ error: 'Title, frequency, and next_due_date required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO preventive_schedules (
        title, description, category_id, apartment_id,
        frequency, next_due_date, assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      title, description || null, category_id || null, apartment_id || null,
      frequency, next_due_date, assigned_to || null
    );
    res.json({ message: 'Preventive schedule created', scheduleId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EMAIL REMINDERS (CRON JOB) ============

if (transporter) {
  const cronSchedule = process.env.REMINDER_CRON || '0 8 * * *'; // Default: 8 AM daily
  
  cron.schedule(cronSchedule, async () => {
    console.log('🔔 Running maintenance reminder check...');
    
    try {
      // Find tasks due tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      const tasks = db.prepare(`
        SELECT 
          t.*,
          u.email as assignee_email,
          u.name as assignee_name,
          a.unit_number
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN apartments a ON t.apartment_id = a.id
        WHERE t.due_date = ? AND t.status != 'completed' AND u.email IS NOT NULL
      `).all(tomorrowStr);
      
      for (const task of tasks) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'maintenance@lmb.local',
          to: task.assignee_email,
          subject: `Reminder: Task due tomorrow - ${task.title}`,
          html: `
            <h2>Maintenance Task Reminder</h2>
            <p>Hello ${task.assignee_name},</p>
            <p>This is a reminder that the following task is due <strong>tomorrow</strong>:</p>
            <ul>
              <li><strong>Title:</strong> ${task.title}</li>
              <li><strong>Unit:</strong> ${task.unit_number || 'N/A'}</li>
              <li><strong>Priority:</strong> ${task.priority}</li>
              <li><strong>Due Date:</strong> ${task.due_date}</li>
            </ul>
            <p>${task.description || ''}</p>
            <p>Please log in to the maintenance app to view details.</p>
            <hr>
            <p><small>La Maison Benoit Labre Maintenance System</small></p>
          `,
        });
      }
      
      console.log(`✅ Sent ${tasks.length} reminder emails`);
    } catch (error) {
      console.error('❌ Error sending reminders:', error);
    }
  });
  
  console.log(`✅ Reminder cron job scheduled: ${cronSchedule}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LMB Maintenance API running on http://localhost:${PORT}`);
});
