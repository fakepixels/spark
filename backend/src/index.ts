import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import presentationRoutes from './routes/presentations.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API routes
app.use('/api', presentationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An internal error occurred'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Spark backend running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Daytona API Key: ${process.env.DAYTONA_API_KEY ? 'Configured' : 'Not configured'}`);
});

export default app;
