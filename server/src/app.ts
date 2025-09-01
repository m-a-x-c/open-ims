import express, { Application } from 'express';

const app: Application = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Inventory Management System API' });
});

export default app;
