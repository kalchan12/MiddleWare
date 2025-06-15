import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool();

export const query = (text: string, params?: any[]) => pool.query(text, params);
