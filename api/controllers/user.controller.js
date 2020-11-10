const httpStatus = require('http-status');
const { createToken } = require('../utils/auth');

module.exports = {
  getAccount: (req, res, next) => {
    // User was authenticated by jwt middleware
    const userId = req.user.id;

    try {
      // GET ACCOUNT

      // Return account
      return res.status(httpStatus.OK).send({
        Account: 'Hello World!',
      });
    } catch (err) {
      // FORWARDING ERROR TO API ERROR HANDLER
      return next(err);
    }
  },

  // Responds with a test token
  getGenericJwt: async (req, res, next) => {
    const randUser = {
      user: {
        id: '123',
      },
    };

    try {
      const token = await createToken(randUser);
      return res.status(httpStatus.OK).send(token);
    } catch (err) {
      return next(err);
    }
  },

  createAccount: (req, res, next) => {
    try {
      // MAKE ACCOUNT


      // Send response
      return res.send({
        Good: 'Job!',
      });
    } catch (err) {
      return next(err);
    }
  },
};
