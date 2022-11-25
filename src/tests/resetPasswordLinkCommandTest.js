const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const uri = '/api/v1/auth/reset/';

describe('resetPasswordLinkCommand', () => {
    beforeEach(() => { });
    it('when email is missing from req data it should return not found', async () => {
        chai
            .request(app)
            .get(uri + '')
            .end((err, res) => {
                res.should.have.status(404);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when user is not found it should return success', async () => {
        chai
            .request(app)
            .get(uri + 'not-test@test.com')
            .end((err, res) => {
                res.should.have.status(400);
                if (err) {
                    console.log(err);
                }
            });
    });
    it('when user is found and email is sent it should return success', async () => {
        chai
            .request(app)
            .get(uri + 'test@test.com')
            .end((err, res) => {
                res.should.have.status(200);
                if (err) {
                    console.log(err);
                }
            });
    });
});