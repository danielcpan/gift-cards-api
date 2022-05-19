import { Document, Schema, Model, model, Types } from 'mongoose';
import type { GiftCardType } from './giftCard.model';

export enum Markets {
  RAISE = 'Raise'
}

export interface MarketType {
  name: string;
  logoUrl: string;
  url: string;
  warranty: number;
}

export interface MarketDocument extends MarketType, Document {
  // giftCards: GiftCardType[];
  giftCards: Types.ObjectId[];
}

interface MarketModel extends Model<MarketDocument> {}

const MarketSchema = new Schema<MarketModel>(
  {
    name: { type: String, enum: [Markets.RAISE], required: true },
    logoUrl: { type: String, required: true },
    url: { type: String, required: true },
    warranty: { type: Number, requried: true },
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
