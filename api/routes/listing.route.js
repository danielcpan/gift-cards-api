const express = require('express');
const listingController = require('controllers/listing.controller');

const router = express.Router();

router.route('/:id').get(listingController.get);

module.exports = router;
