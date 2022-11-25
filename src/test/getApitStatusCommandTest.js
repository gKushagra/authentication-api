const chai = require('chai');
const expect = chai.expect;
const getApiStatusCommand = require('../commands/getApiStatusCommand');

describe('getApiStatusCommand', () => {
    afterEach(() => { });
    it('should return 200 if api is running', async () => {
        const res = await getApiStatusCommand();
        expect(res).to.equal('All API endpoints working.');
    });
});