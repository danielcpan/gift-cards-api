import { Document, Schema, Model, model } from 'mongoose';
import { ListingType } from './listing.model';
import type { MarketType } from './market.model';

export interface GiftCardType {
  name: string;
  logoUrl: string;
  listings: ListingType[];
  markets: MarketType[];
}

export interface GiftCardDocument extends GiftCardType, Document {}

interface GiftCardModel extends Model<GiftCardDocument> {}

const GiftCardSchema = new Schema<GiftCardDocument, GiftCardModel>(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
    markets: [{ type: Schema.Types.ObjectId, ref: 'Market' }]
  },
  {
    timestamps: true
  }
);

// Methods
GiftCardSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject();

  return { id: _id, ...obj };
};

export default model<GiftCardDocument, GiftCardModel>('GiftCard', GiftCardSchema);
