import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import helloRouter from './routes/hello';
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
app.get("/hello", helloRouter); //testing api
app.use("/users", usersRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });
  
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
const { message, status = 500 } = err as any;
    res.status(status).json({ message });
});
export default app;

