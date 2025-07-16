// server.js (or index.js)
import express from 'express';
import prisma from '../src/prisma.js';
import priceRoutes from '../src/routes/priceRouter.js';

import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors({
  origin: 'https://www.cvrmandi.in', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// Middleware
app.use(express.json());

app.use('/api', priceRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running with ES Modules!');
});

// Start server
export default app;

