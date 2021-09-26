import { Document, Schema, Model, model } from 'mongoose';
import type { Market } from './market.model';

export interface GiftCard {
  name: string;
  logoUrl: string;
  markets: Market[];
}

interface History {
  name: string;
  rating: number;
  ratingCount: number;
  quanity: number;
  savings: number;
  cardType: string;
}

export interface GiftCardDocument extends GiftCard, Document {}

interface GiftCardModel extends Model<GiftCardDocument> {}

const GiftCardSchema = new Schema<GiftCardDocument, GiftCardModel>(
  {
    date: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    ratingCount: { type: Number, required: true },
    quanity: { type: Number, required: true },
    savings: { type: Number, required: true },
    giftCard: { type: Schema.Types.ObjectId, ref: 'GiftCard' },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
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
