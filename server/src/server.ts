import 'dotenv/config';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server: Server;

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    server = app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
