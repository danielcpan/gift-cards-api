const httpStatus = require('http-status');
const app = require('../app');
const { clearDatabase } = require('../utils/mongoose.utils');

after(async () => {
  await clearDatabase();
});

describe('## EMAIL APIs', () => {
  before(async () => {});


  describe('# GET /api/users/', () => {
    it('should get user', async () => {
      const response = await request(app).get('/api/users/');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });

  describe('# POST /api/users/', () => {
    it('should create a user', async () => {
      const response = await request(app).post('/api/users/');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });

  describe('# GET /api/users/test-jwt', () => {
    it('should get test jwt', async () => {
      const response = await request(app).get('/api/users/test-jwt');

      expect(response.status).to.equal(httpStatus.OK);
    });
  });
});
