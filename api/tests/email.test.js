const httpStatus = require('http-status');
const app = require('../app');
const { clearDatabase } = require('../utils/mongoose.utils');

after(async () => {
  await clearDatabase();
});

describe('## EMAIL APIs', () => {
  before(async () => {});


  describe('# GET /api/emails/single', () => {
    it('should get single email details', async () => {
      const response = await request(app).get('/api/emails/single');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });

  describe('# GET /api/emails', () => {
    it('should get all emails', async () => {
      const response = await request(app).get('/api/emails');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });
});
