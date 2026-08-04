process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

// Runs once before ALL tests in this file
before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Runs once after ALL tests in this file
after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Runs before EACH individual test - keeps tests independent from each other
beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body.user.email).to.equal('test@example.com');
      expect(res.body.user).to.not.have.property('password');
    });

    it('should reject signup with a duplicate email', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Another User', email: 'test@example.com', password: 'password456' });

      expect(res.status).to.equal(400);
    });

    it('should reject signup with an empty password', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test2@example.com', password: '' });

      expect(res.status).to.equal(400);
    });

    it('should reject signup with an invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'not-an-email', password: 'password123' });

      expect(res.status).to.equal(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user to log in with, before each login test
      await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    });

    it('should log in successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should reject login with the wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).to.equal(400);
    });

    it('should reject login with an unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unknown@example.com', password: 'password123' });

      expect(res.status).to.equal(400);
    });
  });

});