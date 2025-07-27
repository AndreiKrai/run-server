import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import helloRouter from "./routes/hello";
import setupPassport from './services/google';
import userRoutes from './routes/user';
import eventsRoutes from "./routes/events";
// Налаштування змінних середовища
dotenv.config();

// Створення екземпляру Express
const app = express();
const PORT = process.env.PORT || 8000;

// Setup Passport
const passport = setupPassport();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Google OAuth
app.use(passport.initialize());
// test
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript + Docker API 🚀");
});

//using routes
app.use("/hello", helloRouter);
app.use("/auth", authRouter);
app.use("/users", userRoutes);
app.use("/events", eventsRoutes);

// Debug request path - add this to diagnose routing issues
app.use((req: Request, res: Response, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  next();
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(
  (err: Error, req: Request, res: Response, next: express.NextFunction) => {
    const { message, status = 500 } = err as any;
    res.status(status).json({ message });
  }
);
export default app;
