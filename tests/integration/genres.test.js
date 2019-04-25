const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    beforeEach(() => server = require('../../index'));
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({})
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 400 if invalid id format', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(400);
        });

        it('should return 404 not found', async () => {
            const id = new mongoose.Types.ObjectId().toHexString();

            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
        });

        it('should return genre if a valid id is passed', async () => {
            const genre = new Genre({ name : 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }


        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        
        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = 'a'.repeat(51);

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if duplicate genre', async () => {
            name = 'genre1';

            await exec();

            const res = await exec();

            expect(res.status).toBe(400);
        });


        it('should save the genre if it is valid', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });

    });
});
