const express = require('express');
const emailController = require('../controllers/email.controller');
const { isLoggedIn } = require('../utils/customMiddleware');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/single')
  .get(isLoggedIn, emailController.getEmail)
  .post(emailController.getAllEmails);

router.route('/')
  .get(emailController.getAllEmails);

module.exports = router;
