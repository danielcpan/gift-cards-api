import { Document, Schema, Model, model } from 'mongoose';
import type { Market } from './market.model';

export interface GiftCard {
  name: string;
  logoUrl: string;
  markets: Market[];
}

export interface GiftCardDocument extends GiftCard, Document {}

interface GiftCardModel extends Model<GiftCardDocument> {}

const GiftCardSchema = new Schema<GiftCardDocument, GiftCardModel>(
  {
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
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
