import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfghj';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  // build a JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create JWT token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object { jwt: token }
  const session = {
    jwt: token,
  };

  // turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string, that's the cookie with encoded data
  return [`express:sess=${base64}`];
};
