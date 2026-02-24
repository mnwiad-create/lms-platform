import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { orgUnitRoutes } from './routes/org-units.js';
import { courseRoutes } from './routes/courses.js';
import { quizRoutes } from './routes/quizzes.js';
import { gradingRoutes } from './routes/grading.js';
import { videoRoutes } from './routes/video.js';
import { analyticsRoutes } from './routes/analytics.js';
import { systemConfigRoutes } from './routes/system-config.js';
import { errorHandler } from './middleware/error-handler.js';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true,
}));

// Health check
app.get('/api/v1/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/users', userRoutes);
app.route('/api/v1/org-units', orgUnitRoutes);
app.route('/api/v1/courses', courseRoutes);
app.route('/api/v1/quizzes', quizRoutes);
app.route('/api/v1/grading', gradingRoutes);
app.route('/api/v1/video', videoRoutes);
app.route('/api/v1/analytics', analyticsRoutes);
app.route('/api/v1/system-config', systemConfigRoutes);

// Error handler
app.onError(errorHandler);

// 404
app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404));

const port = parseInt(process.env.PORT || '3001', 10);
console.log(`LMS API running on port ${port}`);
serve({ fetch: app.fetch, port });
