const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');

const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');

describe('/api/returns', () => {
    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    beforeEach(async () => {
        server = require('../../index');

        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '1234567890'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            genre: { name: '12345' },
            numberInStock: 10,
            dailyRentalRate: 2
        });
        await movie.save();

    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close();
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie', async () => {
        await Rental.deleteMany({})
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if return already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the return date', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = Date.now() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate the rental fee', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(7 * 2);
    });

    it('should increase the stock', async () => {
        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental info', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body))
            .toEqual(
                expect.arrayContaining(Object.keys(rentalInDb._doc))
            );
    });

});