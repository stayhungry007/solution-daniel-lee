const request = require('supertest');
const app = require('../index'); // Assuming the Koa app is exported from index.js
const { User, Issue } = require('../models');  // Assuming models are used here

// Helper function to create a user for testing
// __tests__/issues.test.js

describe('Authentication and Issues API', () => {
    let token;

    beforeAll(async () => {
        // Assuming you have a register and login flow already set up.
        const userResponse = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password' });

        const loginResponse = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password' });

        token = loginResponse.body.token;
    });

    // Test Registering New User
    it('should allow a user to register', async () => {
        const response = await request(app)
            .post('/register')
            .send({ email: 'newuser@example.com', password: 'newpassword' })
            .expect(201);
        
        expect(response.body).toHaveProperty('email');
    });

    // Test login
    it('should log in with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200);
        
        expect(response.body).toHaveProperty('token');
    });

    // Test Creating an Issue
    it('should create a new issue', async () => {
        const response = await request(app)
            .post('/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test issue', description: 'Issue description' })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test issue');
    });

    // Test Listing Issues
    it('should list all issues', async () => {
        const response = await request(app)
            .get('/issues')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test Updating an Issue
    it('should update an issue', async () => {
        const newIssue = await request(app)
            .post('/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test issue', description: 'Issue description' });

        const updatedResponse = await request(app)
            .put(`/issues/${newIssue.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Issue', description: 'Updated description' })
            .expect(200);

        expect(updatedResponse.body.title).toBe('Updated Issue');
        expect(updatedResponse.body.description).toBe('Updated description');
    });

    // Test Getting Issue Revisions
    it('should get issue revisions', async () => {
        const newIssue = await request(app)
            .post('/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test issue', description: 'Issue description' });

        const revisionResponse = await request(app)
            .get(`/issues/${newIssue.body.id}/revisions`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(revisionResponse.body)).toBe(true);
    });

    // Test Unauthorized Access
    it('should return 401 for unauthenticated requests', async () => {
        const response = await request(app)
            .post('/issues')
            .send({ title: 'New Issue', description: 'Description' })
            .expect(401);
        
        expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    // Test Invalid Data (Create Issue without required fields)
    it('should return error for invalid data when creating an issue', async () => {
        const response = await request(app)
            .post('/issues')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: '' })
            .expect(400);

        expect(response.body).toHaveProperty('message', 'Validation error: description cannot be empty');
    });
});

