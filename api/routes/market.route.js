const express = require('express');
const marketController = require('controllers/market.controller');

const router = express.Router();

router.route('/:id').get(marketController.get);

module.exports = router;
