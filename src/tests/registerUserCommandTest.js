const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const uri = '/api/v1/auth/register';

describe('registerUserCommand', () => {
    beforeEach(() => { });
    it('when req body is invalid it should return bad request', async () => {
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
    it('when user already exists it should return a bad request', async () => {
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: 'test@test.com', password: 'test' })
            .end((err, res) => {
                res.should.have.status(400);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when user is created successfully it should return success', async () => {
        const randomString = (Math.random() + 1).toString(36).substring(7);
        chai
            .request(app)
            .post(uri)
            .set('content-type', 'application/json')
            .send({ email: `${randomString}@test.com`, password: randomString })
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