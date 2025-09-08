import express, { Application } from 'express';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorhandler';

const app: Application = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Inventory Management System API' });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
