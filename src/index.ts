import 'dotenv/config';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      details: `The endpoint ${req.method} ${req.path} does not exist`,
    },
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal error',
      details: err.message,
    },
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Skin Price Aggregator - CS GO started`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`   GET /health - Health check`);
});

export default app;
