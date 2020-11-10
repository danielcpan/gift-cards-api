const { verifyToken } = require('./auth');

module.exports = {
  login: async (req, res, next) => {
    console.log('IN CUSTOM MIDDLEWARE LOGIN()');
    const { token } = req.body;

    console.log(req.body);

    if (!token) return next();

    try {
      const payload = await verifyToken(token);
      console.log(payload);

      if (payload && payload.user) {
        console.log('Successfully logged in');
        req.user = payload.user;
      }
    } catch (err) {
      console.log(err);
    }

    return next();
  },

  isLoggedIn: (req, res, next) => {
    console.log('IN CUSTOM MIDDLEWARE ISLOGGEDIN()');

    if (req.user) return next();

    return res.status(403).send('Please log in by providing a valid token with your request!');
  },
};
