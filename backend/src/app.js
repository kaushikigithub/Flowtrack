const express = require('express');
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://flowtrack-plum.vercel.app'
  ],
  credentials: true
}));

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const storyRoutes = require('./routes/storyRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FlowTrack API is running 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;