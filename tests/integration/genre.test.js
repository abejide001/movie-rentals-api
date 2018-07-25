/**
 * test for the genre model
 */
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
//testing the genres
describe('/api/genres', () => {
    let server;
    
    //load the server
    beforeEach(() => {server = require('../../index')});
    //close the server
    afterEach(async() => {
        await server.close();
        //clean up the database to avoid duplicates
        await Genre.remove({})
    })
    describe('GET /', () => {
        it('should return all genres', async() => {
            //polpulate the genre collections
        await Genre.collection.insertMany([
                {name : "crime"},
                {name : "romance"}
            ])
            //get the response
            const res = await request(server).get('/api/genres');
            //make the asseertion
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === "crime"));
        })
    })
    //get a single genre
    describe('GET /:id', () => {
        it('should return a genre if valid ID is passes', async() => {
            //create the genre
            const genre = new Genre({name : 'block'})
            await genre.save()
            //get the response
            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return a genre 404 if invalid id is passed', async() => {
            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        })
    })
    // create a new genre
    describe('POST /', () => {
        it('should return a 401 if user is not logged in', async() => {
            const res = await request(server).post('/api/genres').send({name : 'genre1'})
            expect(res.status).toBe(401)
        })
        it('should return 400 if genre is less than 5 chars', async() => {
            const token = new User().generateAuthToken();
            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)//..set the token
            .send({name : '1244'})
            expect(res.status).toBe(400)
        })
        it('should save the genre if it is valid', async() => {
            const token = new User().generateAuthToken();
            const res = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name : 'genre1'})
            const genre = await Genre.find({name : 'genre1'}) 
            expect(genre).not.toBeNull();
        })
    })
})