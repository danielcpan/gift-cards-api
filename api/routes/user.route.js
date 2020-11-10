const express = require('express');
const userController = require('../controllers/user.controller');
const { isLoggedIn } = require('../utils/customMiddleware');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(isLoggedIn, userController.getAccount)
  .post(userController.createAccount);

router.route('/test-jwt')
  .get(userController.getGenericJwt);

module.exports = router;
