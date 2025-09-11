import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorhandler';

const app: Application = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));

app.get('/', (_req, res) => {
  res.json({ message: 'Inventory Management System API' });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
