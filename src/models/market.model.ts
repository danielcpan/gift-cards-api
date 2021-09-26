import { Document, Schema, Model, model } from 'mongoose';
import type { GiftCard } from './giftCard.model';
import type { Listing } from './listing.model';

export interface Market {
  name: string;
  logoUrl: string;
  url: string;
  warranty: number;
  giftCards: GiftCard[];
  listings: Listing[];
}

export interface MarketDocument extends Document {}

interface MarketModel extends Model<MarketDocument> {}

const MarketSchema = new Schema<MarketModel>(
  {
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    url: { type: String, required: true },
    warranty: { type: Number, requried: true },
    giftCards: [{ type: Schema.Types.ObjectId, ref: 'GiftCard' }],
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
  },
  {
    timestamps: true
  }
);

// Methods
MarketSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject();

  return { id: _id, ...obj };
};

export default model<MarketDocument, MarketModel>('Market', MarketSchema);
