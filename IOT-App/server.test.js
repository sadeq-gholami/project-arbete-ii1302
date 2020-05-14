const supertest = require("supertest");
const app = require("./server.js");
const request = supertest(app)

describe("Test the list all devices endpoint", () => {
    it('should respond with GET method', async done => {
        const response = await request.get('/devices'); 
        expect(response.status).toBe(200);
        done();
    });
});

describe("Test the add device endpoint", () => {
    it('should add a device and respond status code 201', async done => {
        const response = await request.post('/devices')
        .send({
            "deviceID" : "testID"
        });
        expect(response.status).toBe(201);
        done();
    });
});

describe("Test the delete device endpoint", () => {
    it('should delete a device with specified ID and respond with status code 200', async done => {
        const response = await request.delete('/devices/testID'); 
        expect(response.status).toBe(200);
        done();
    });
});