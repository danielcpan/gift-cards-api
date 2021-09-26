import { Document, Schema, Model, model } from 'mongoose';
import type { GiftCardType } from './giftCard.model';
import type { ListingType } from './listing.model';

export enum Markets {
  RAISE = 'Raise'
}

export interface MarketType {
  // name: string;
  logoUrl: string;
  url: string;
  warranty: number;
  giftCards: GiftCardType[];
  listings: ListingType[];
}

export interface MarketDocument extends MarketType, Document {}

interface MarketModel extends Model<MarketDocument> {}

const MarketSchema = new Schema<MarketModel>(
  {
    _id: { type: String, enum: [Markets.RAISE], required: true },
    // name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    url: { type: String, required: true },
    warranty: { type: Number, requried: true },
    giftCards: [{ type: Schema.Types.ObjectId, ref: 'GiftCard' }],
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
  },
  {
    timestamps: true,
    _id: false
  }
);

// Methods
MarketSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject();

  return { id: _id, ...obj };
};

export default model<MarketDocument, MarketModel>('Market', MarketSchema);
