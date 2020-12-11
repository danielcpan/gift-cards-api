const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    giftCardId: {
      type: String,
      required: true
    },
    marketId: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Listing', ListingSchema);
