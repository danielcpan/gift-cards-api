import GiftCard, { GiftCardDocument, GiftCardDTO } from '../models/giftCard.model';
import Market, { Markets } from '../models/market.model';
import HistoricalRecord, { HistoricalRecordDTO } from '../models/historicalRecord.model';

const get = (giftCardId: string) => {
  return GiftCard.findById(giftCardId).populate('listings').populate('historicalRecords').exec();
};

const upsert = async (data: HistoricalRecordDTO) => {
  try {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

    const historicalRecord = await HistoricalRecord.findOneAndUpdate(
      {
        market: Markets.RAISE,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      },
      data,
      { new: true, upsert: true }
    );

    return historicalRecord;
  } catch (err) {
    console.error('GiftCard Upsert Error:', err);
  }
};

export default { get, list, upsert };
