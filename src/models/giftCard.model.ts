import { Document, Schema, Model, model } from 'mongoose';
import { HistoricalRecordType } from './historicalRecord';
import { ListingType } from './listing.model';
import type { MarketType } from './market.model';

export interface GiftCardType {
  name: string;
  logoUrl: string;
  listings: ListingType[];
  markets: MarketType[];
  historicalRecords: HistoricalRecordType[];
}

export interface GiftCardDocument extends GiftCardType, Document {}

interface GiftCardModel extends Model<GiftCardDocument> {}

const GiftCardSchema = new Schema<GiftCardDocument, GiftCardModel>(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
    markets: [{ type: Schema.Types.ObjectId, ref: 'Market' }],
    historicalRecords: [{ type: Schema.Types.ObjectId, ref: 'HistoricalRecord' }]
  },
  {
    timestamps: true
  }
);

// GiftCardSchema.virtuals('inventoryValue').get(function () {
//   return this.listings.reduce((acc, el: ListingType) => acc + el.value, 0);
// });

// Methods
GiftCardSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject({ virtuals: true });

  return { id: _id, ...obj };
};

// GiftCardSchema.methods.

export default model<GiftCardDocument, GiftCardModel>('GiftCard', GiftCardSchema);
