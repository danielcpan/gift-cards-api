const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    price: { type: Number, required: true },
    giftCard: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' },
    market: { type: mongoose.Schema.Types.ObjectId, ref: 'Market' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', ListingSchema);
