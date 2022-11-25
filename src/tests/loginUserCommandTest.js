const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const uri = '/api/v1/auth/login';

describe('loginUserCommand', () => {
    beforeEach(() => { });
    it('when req body contains invalid data it should return bad request', async () => {
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: '', password: '' })
            .end((err, res) => {
                res.should.have.status(400);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when user does not exist it should return user not found', async () => {
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: 'not-test@test.com', password: 'not-test' })
            .end((err, res) => {
                res.should.have.status(400);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when password is invalid it should return unauthorized', async () => {
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: 'test@test.com', password: 'not-test' })
            .end((err, res) => {
                res.should.have.status(401);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when password is valid it should return authorized', async () => {
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: 'test@test.com', password: 'test' })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.should.have.status(200);
                    expect(res.body['token']).to.not.be.null;
                    done();
                }
            });
    });
});