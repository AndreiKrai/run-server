import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
// Налаштування змінних середовища
dotenv.config();

// Створення екземпляру Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовий маршрут
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript + Docker API 🚀');
});
//using routes
app.use(routes);

export default app;

