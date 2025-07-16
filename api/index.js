// server.js (or index.js)
import express from 'express';
import prisma from '../src/prisma.js';
import priceRoutes from '../src/routes/priceRouter.js';

import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use('/api', priceRoutes);
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running with ES Modules!');
});

// Start server
export default app;

