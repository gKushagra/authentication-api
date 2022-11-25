const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const uri = '/api/v1/auth/reset/';

describe('resetPasswordCommand', () => {
    beforeEach(() => { });
    it('when requestId is missing it should return not found', async () => {
        chai
            .request(app)
            .post(uri + ``)
            .set('content-type', 'application/json')
            .send({ password: 'test' })
            .end((err, res) => {
                res.should.have.status(404);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when req body is invalid it should return bad request', async () => {
        chai
            .request(app)
            .post(uri + 'requestId')
            .set('content-type', 'application/json')
            .send({ password: '' })
            .end((err, res) => {
                res.should.have.status(400);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when requestId and req body is valid it should return success', async () => {
        chai
            .request(app)
            .post(uri + 'requestId')
            .set('content-type', 'application/json')
            .send({ password: 'test' })
            .end((err, res) => {
                res.should.have.status(200);
                if (err) {
                    console.log(err);
                }
            });
    });
});