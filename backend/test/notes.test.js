const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Note = require('../models/Note');

let userAToken;
let userBToken;

beforeEach(async () => {
  await User.deleteMany({});
  await Note.deleteMany({});

  await request(app)
    .post('/api/auth/signup')
    .send({ name: 'User A', email: 'usera@example.com', password: 'password123' });

  const loginA = await request(app)
    .post('/api/auth/login')
    .send({ email: 'usera@example.com', password: 'password123' });
  userAToken = loginA.body.token;

  await request(app)
    .post('/api/auth/signup')
    .send({ name: 'User B', email: 'userb@example.com', password: 'password123' });

  const loginB = await request(app)
    .post('/api/auth/login')
    .send({ email: 'userb@example.com', password: 'password123' });
  userBToken = loginB.body.token;
});

describe('Notes API', () => {

  describe('POST /api/notes', () => {
    it('should create a note when authenticated', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ title: 'My note', content: 'Some content' });

      expect(res.status).to.equal(201);
      expect(res.body.note.title).to.equal('My note');
    });

    it('should reject creating a note without a token', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'My note', content: 'Some content' });

      expect(res.status).to.equal(401);
    });

    it('should reject creating a note with an empty title', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ title: '', content: 'Some content' });

      expect(res.status).to.equal(400);
    });
  });

  describe('GET /api/notes', () => {
    it('should only return notes belonging to the logged-in user', async () => {
      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ title: 'User A note', content: '...' });

      await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ title: 'User B note', content: '...' });

      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.notes).to.have.lengthOf(1);
      expect(res.body.notes[0].title).to.equal('User A note');
    });
  });

  describe('GET /api/notes/:id, PUT /api/notes/:id, DELETE /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ title: 'User A note', content: 'Original content' });
      noteId = createRes.body.note._id;
    });

    it('should fetch a single note owned by the user', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.note._id).to.equal(noteId);
    });

    it('should NOT allow user B to fetch user A\'s note', async () => {
      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).to.equal(404);
    });

    it('should update a note owned by the user', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ title: 'Updated title' });

      expect(res.status).to.equal(200);
      expect(res.body.note.title).to.equal('Updated title');
    });

    it('should NOT allow user B to update user A\'s note', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ title: 'Hacked title' });

      expect(res.status).to.equal(404);
    });

    it('should delete a note owned by the user', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).to.equal(200);
    });

    it('should NOT allow user B to delete user A\'s note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).to.equal(404);
    });

    it('should return 400 for a malformed note ID', async () => {
      const res = await request(app)
        .get('/api/notes/not-a-valid-id')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).to.equal(400);
    });
  });

});