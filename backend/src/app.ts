import fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.routes.js';
import { profileRoutes } from './routes/profile.routes.js';
// Make sure env is loaded and validated before starting the app
import './config/env.js';

export function buildApp() {
  const app = fastify({
    logger: true,
  });

  app.register(cors, {
    origin: '*', // Adjust for production
  });

  app.register(healthRoutes);
  app.register(profileRoutes);

  return app;
}
