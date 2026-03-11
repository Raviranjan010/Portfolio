import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Project from './models/Project.js';
import ContactMessage from './models/ContactMessage.js';
import { getContactRecipient, isMailConfigured, sendContactEmails } from './lib/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const allowedOrigins = [CLIENT_URL, 'http://localhost:8080', 'http://localhost:5173'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const trimValue = (value) => typeof value === 'string' ? value.trim() : '';
const isDatabaseReady = () => mongoose.connection.readyState === 1;

// Middleware
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    },
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes

app.get('/api/health', async (req, res) => {
    const dbState = isDatabaseReady() ? 'connected' : 'disconnected';

    res.json({
        ok: dbState === 'connected',
        database: dbState,
        mail: isMailConfigured() ? 'configured' : 'missing_credentials',
        contactRecipient: getContactRecipient(),
        timestamp: new Date().toISOString(),
    });
});

// 1. Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        if (!isDatabaseReady()) {
            return res.json([]);
        }

        const projects = await Project.find().sort({ id: 1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.json([]);
    }
});

// 2. Submit contact message
app.post('/api/contact', async (req, res) => {
    try {
        const name = trimValue(req.body?.name);
        const email = trimValue(req.body?.email).toLowerCase();
        const subject = trimValue(req.body?.subject);
        const message = trimValue(req.body?.message);

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }

        if (name.length > 100 || email.length > 160 || subject.length > 160 || message.length > 5000) {
            return res.status(400).json({ message: 'One or more fields exceed the allowed length.' });
        }

        const canPersist = isDatabaseReady();
        const newMessage = canPersist ? new ContactMessage({
            name,
            email,
            subject,
            message,
            source: {
                ip: req.ip || '',
                userAgent: req.get('user-agent') || '',
                origin: req.get('origin') || '',
            },
        }) : null;

        if (newMessage) {
            await newMessage.save();
        }

        const delivery = await sendContactEmails({
            name,
            email,
            subject,
            message,
            createdAt: newMessage?.createdAt || new Date(),
        });

        if (delivery.delivered && newMessage) {
            newMessage.status = 'delivered';
            newMessage.deliveredAt = new Date();
            newMessage.failureReason = '';
            await newMessage.save();
        }

        if (delivery.delivered) {
            return res.status(201).json({
                message: canPersist
                    ? 'Message sent successfully. Check your inbox for a confirmation email.'
                    : 'Message emailed successfully. Database storage is currently unavailable.',
            });
        }

        if (newMessage) {
            newMessage.status = 'failed';
            newMessage.failureReason = delivery.reason;
            await newMessage.save();
        }

        return res.status(202).json({
            message: canPersist
                ? 'Message saved, but email delivery is not configured yet.'
                : 'Message could not be stored because the database is unavailable, and email delivery is not configured yet.',
            warning: delivery.reason || 'Database is unavailable.',
        });
    } catch (err) {
        console.error('Error saving contact message:', err);
        res.status(500).json({ message: 'Server error saving message.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
