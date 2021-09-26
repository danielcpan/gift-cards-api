import { Document, Schema, Model, model } from 'mongoose';
import type { GiftCardType } from './giftCard.model';
import type { MarketType } from './market.model';

export enum CardTypes {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL'
}

export interface ListingType {
  type: CardTypes;
  value: number;
  savings: number;
  giftCard: GiftCardType;
  market: MarketType;
}

export interface ListingDocument extends ListingType, Document {}

interface ListingModel extends Model<ListingDocument> {}

const ListingSchema = new Schema<ListingDocument, ListingModel>(
  {
    type: {
      type: String,
      enum: [CardTypes.PHYSICAL, CardTypes.DIGITAL],
      default: CardTypes.DIGITAL,
      required: true
    },
    value: { type: Number, required: true },
    savings: { type: Number, required: true },
    giftCard: { type: Schema.Types.ObjectId, ref: 'GiftCard' },
    market: { type: Schema.Types.ObjectId, ref: 'Market' }
  },
  {
    timestamps: true
  }
);

// Methods
ListingSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject();

  return { id: _id, ...obj };
};

export default model<ListingDocument, ListingModel>('Listing', ListingSchema);
