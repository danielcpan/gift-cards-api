const express = require('express');
const marketRoutes = require('./market.route');
const giftCardRoutes = require('./giftCard.route');
const listingRoutes = require('./listing.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/markets', marketRoutes);
router.use('/giftCards', giftCardRoutes);
router.use('/listings', listingRoutes);

module.exports = router;
