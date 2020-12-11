const express = require('express');
const giftCardController = require('controllers/giftCard.controller');

const router = express.Router();

router.route('/:id').get(giftCardController.get);

module.exports = router;
