import { Document, Schema, Model, model } from 'mongoose';
import type { GiftCard } from './giftCard.model';

export interface Market {
  name: string;
  logoUrl: string;
  url: string;
  giftCards: GiftCard[];
}

export interface MarketDocument extends Document {}

interface MarketModel extends Model<MarketDocument> {}

const MarketSchema = new Schema<MarketModel>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    url: { type: String },
    giftCards: [{ type: Schema.Types.ObjectId, ref: 'GiftCard' }]
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
