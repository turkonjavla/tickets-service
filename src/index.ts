import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  const { TICKETS_MONGO_URI, JWT_KEY } = process.env;

  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!TICKETS_MONGO_URI) {
    throw new Error('TICKETS_MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'sfegrht', 'http://nats-srv:4222');

    natsWrapper.client.on('close', () => {
      console.log('Nats connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(TICKETS_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Tickets service connected to mongodb');
  } catch (error) {
    console.error('Error connecting to mongodb: ', error.message);
  }
  app.listen(3000, () => console.log(`Ready at http://locahost:3000`));
};

start();
