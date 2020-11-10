const httpStatus = require('http-status');

module.exports = {
  getEmail: (req, res, next) => {
    // User was authenticated by jwt middleware
    const userId = req.user.id;
    console.log(userId);

    try {
      // GET EMAIL

      // Respond
      return res.status(httpStatus.OK).send({
        Email: 'Hello World!',
      });
    } catch (err) {
      return next(err);
    }
  },

  getAllEmails: (req, res, next) => {
    // User was authenticated by jwt middleware
    const userId = req.user.id;
    console.log(userId);

    try {
      // GET ALL EMAILS

      // Respond
      return res.status(httpStatus.OK).send({
        Email: 'Hello World!',
      });
    } catch (err) {
      return next(err);
    }
  },
};
