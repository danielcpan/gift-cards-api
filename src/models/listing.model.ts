import { Document, Schema, Model, model } from 'mongoose';
import type { GiftCard } from './giftCard.model';
import type { Market } from './market.model';

enum CardType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL'
}

export interface Listing {
  type: CardType;
  value: number;
  savings: number;
  giftCard: GiftCard;
  market: Market;
}

export interface ListingDocument extends Listing, Document {}

interface ListingModel extends Model<ListingDocument> {}

const ListingSchema = new Schema<ListingDocument, ListingModel>(
  {
    type: {
      type: String,
      enum: [CardType.PHYSICAL, CardType.DIGITAL],
      default: CardType.DIGITAL,
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
