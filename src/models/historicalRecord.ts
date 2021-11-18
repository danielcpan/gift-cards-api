import { Document, Schema, Model, model } from 'mongoose';
import { GiftCardType } from './giftCard.model';
import type { MarketType } from './market.model';

export interface HistoricalRecordDTO {
  // Note: Not a true date, has YYYY-MM-DD format
  date: Date;
  quantity: number;
  inventory: number;
  bestSavings: number;
  avgSavings: number;
}
export interface HistoricalRecordType extends HistoricalRecordDTO {
  giftCard: GiftCardType;
  market: MarketType;
}

export interface HistoricalRecordDocument extends HistoricalRecordType, Document {}

interface HistoricalRecordModel extends Model<HistoricalRecordDocument> {}

const HistoricalRecordSchema = new Schema<HistoricalRecordDocument, HistoricalRecordModel>(
  {
    date: { type: Date, required: true, unique: true },
    quantity: { type: Number, required: true },
    inventory: { type: Number, required: true },
    bestSavings: { type: Number, required: true },
    avgSavings: { type: Number, required: true },
    giftCard: { type: Schema.Types.ObjectId, ref: 'GiftCard' },
    market: { type: Schema.Types.ObjectId, ref: 'Market' }
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
