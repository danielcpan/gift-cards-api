const express = require('express');
// const userRoutes = require('./user.route');
// const emailRoutes = require('./email.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

// router.use('/users', userRoutes);
// router.use('/emails', emailRoutes);

module.exports = router;
