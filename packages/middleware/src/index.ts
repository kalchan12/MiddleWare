import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import analyticsRouter from './routes/analytics';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/analytics', analyticsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
