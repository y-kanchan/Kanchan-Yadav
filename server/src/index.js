import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import { startSyncScheduler, syncGitHubRepos } from './services/githubSync.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running smoothly' });
});

// Start scheduler
startSyncScheduler();

// Trigger initial GitHub sync in the background on startup
// This ensures that the portfolio database has projects immediately upon setup.
(async () => {
  try {
    console.log('[Startup] Triggering initial background GitHub sync...');
    await syncGitHubRepos();
  } catch (error) {
    console.error(`[Startup] Initial GitHub sync failed: ${error.message}`);
  }
})();

// Port setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
