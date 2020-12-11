const mongoose = require('mongoose');

const GiftCardSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
    },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('GiftCard', GiftCardSchema);
