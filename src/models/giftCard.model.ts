import { Document, Schema, Model, model, Types } from 'mongoose';
import { HistoricalRecordType } from './historicalRecord.model';
import type { MarketType } from './market.model';

export enum CardTypes {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL'
}

export interface GiftCardDTO {
  extId: string;
  name: string;
  logoUrl: string;
  type: CardTypes;
  market: Types.ObjectId;
}
export interface GiftCardType extends GiftCardDTO {
  historicalRecords: Types.ObjectId[];
}

export interface GiftCardDocument extends GiftCardType, Document {}

interface GiftCardModel extends Model<GiftCardDocument> {}

const GiftCardSchema = new Schema<GiftCardDocument, GiftCardModel>(
  {
    extId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String, required: true },
    type: { type: String, enum: [CardTypes.PHYSICAL, CardTypes.DIGITAL], required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    historicalRecords: [{ type: Schema.Types.ObjectId, ref: 'HistoricalRecord' }]
  },
  {
    timestamps: true
  }
);

// Methods
GiftCardSchema.methods.transform = function () {
  const { _id, ...obj } = this.toObject({ virtuals: true });

  return { id: _id, ...obj };
};

export default model<GiftCardDocument, GiftCardModel>('GiftCard', GiftCardSchema);
