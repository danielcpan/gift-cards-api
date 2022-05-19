import { Document, Schema, Model, model } from 'mongoose';
import { GiftCardType } from './giftCard.model';
import type { MarketType } from './market.model';

export interface HistoricalRecordDTO {
  available: boolean;
  quantityAvailable: number;
  rating: string;
  ratingCount: number;
  cashback: string;
  savings: string;
  soldLastDay: number;
}
export interface HistoricalRecordType extends HistoricalRecordDTO {
  giftCard: GiftCardType;
  market: MarketType;
}

export interface HistoricalRecordDocument extends HistoricalRecordType, Document {}

interface HistoricalRecordModel extends Model<HistoricalRecordDocument> {}

const HistoricalRecordSchema = new Schema<HistoricalRecordDocument, HistoricalRecordModel>(
  {
    available: { type: Boolean, required: true },
    quantityAvailable: { type: Number, required: true },
    rating: { type: String, required: true },
    ratingCount: { type: Number, required: true },
    cashback: { type: String, required: true },
    savings: { type: String, required: true },
    soldLastDay: { type: Number, required: true },
    giftCard: { type: Schema.Types.ObjectId, ref: 'GiftCard' }
  },
  {
    timestamps: true
  }
);

// Methods
HistoricalRecordSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject();

  return { id: _id, ...obj };
};

export default model<HistoricalRecordDocument, HistoricalRecordModel>(
  'HistoricalRecord',
  HistoricalRecordSchema
);
