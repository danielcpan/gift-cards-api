const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    logoUrl: { type: String, required: true },
    giftCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' }],
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
  },
  { timestamps: true }
);
module.exports = mongoose.model('Market', MarketSchema);
