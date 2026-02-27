import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import bodyPartsRoutes from './routes/bodyParts';
import exercisesRoutes from './routes/exercises';
import workoutsRoutes from './routes/workouts';
import nutritionRoutes from './routes/nutrition';
import activityRoutes from './routes/activity';
import reportsRoutes from './routes/reports';
import healthRoutes from './routes/health';
import chatRoutes from './routes/chat';
import coachesRoutes from './routes/coaches';
import coachApplicationsRoutes from './routes/coachApplications';
import bookingsRoutes from './routes/bookings';
import messagesRoutes from './routes/messages';
import coachDashboardRoutes from './routes/coachDashboard';
import adminRoutes from './routes/admin';
import notificationsRoutes from './routes/notifications';
import path from 'path';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/body-parts', bodyPartsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/coach-applications', coachApplicationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/coach-dashboard', coachDashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Human Performance Science Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      bodyParts: '/api/body-parts',
      exercises: '/api/exercises',
      workouts: '/api/workouts',
      nutrition: '/api/nutrition',
      activity: '/api/activity',
      reports: '/api/reports',
      health: '/api/health',
      chat: '/api/chat'
    }
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  Human Performance Science Platform API               ║
║  Server running on port ${PORT}                       ║
║  Environment: ${process.env.NODE_ENV || 'development'}               ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
