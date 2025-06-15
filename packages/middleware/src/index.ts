import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import analyticsRouter from './routes/analytics';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Centralized database query handling
import { Pool } from 'pg';
const pool = new Pool();
const handleDatabaseQuery = async (query: string, params: any[] = [], res: express.Response) => {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error' });
    return null;
  }
};

// Modular routes
app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
