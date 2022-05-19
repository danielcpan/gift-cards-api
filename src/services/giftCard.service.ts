import GiftCard, { GiftCardDocument, GiftCardDTO } from '../models/giftCard.model';
import Market, { Markets } from '../models/market.model';
import HistoricalRecord, { HistoricalRecordDTO } from '../models/historicalRecord.model';

const get = (giftCardId: string) => {
  return GiftCard.findById(giftCardId).populate('historicalRecords').exec();
};

const upsert = async (giftCardData: GiftCardDTO) => {
  try {
    const giftCard = await GiftCard.findOneAndUpdate(
      { extId: giftCardData.extId },
      // { ...giftCardData, market: Markets.RAISE },
      { ...giftCardData, market: giftCardData.market },
      {
        new: true,
        upsert: true,
        populate: 'market'
      }
    );

    // const historicalRecord = await HistoricalRecord.findOneAndUpdate({
    //   market: giftCard.market._id,
    //   createdAt: {
    //     $gte: startOfDay,
    //     $lte: endOfDay
    //   }
    // });

    // giftCard.historicalRecords.push(historicalRecord._id);

    // giftCard.save();

    return giftCard;
  } catch (err) {
    console.error('GiftCard Upsert Error:', err);
  }
};

// const upsertHistoricalRecord = async (marketId: string, giftCardId: string) => {
//   const market = await Market.findById(marketId);
//   const giftCard = await GiftCard.findById(giftCardId).populate('listings');

//   const data = giftCard.listings.reduce<any>(
//     ({ inventory, bestSavings, totalSavings }, el: ListingType) => ({
//       inventory: inventory + el.value,
//       bestSavings: Math.max(bestSavings, el.savings),
//       totalSavings: totalSavings + el.value * (el.savings / 100)
//     }),
//     { inventory: 0, bestSavings: 0, totalSavings: 0 }
//   );

//   // NOTE: Ignores time values. We only care about date.
//   const today = new Date(new Date().toISOString().split('T')[0]);

//   const historicalRecord = await HistoricalRecord.findOneAndUpdate(
//     { date: today },
//     {
//       date: today,
//       quantity: giftCard.listings.length,
//       inventory: data.inventory,
//       bestSavings: data.bestSavings,
//       avgSavings: data.inventory / data.totalSavings,
//       giftCard: giftCard.id,
//       market: market.id
//     },
//     { new: true, upsert: true }
//   );

//   return historicalRecord;
// };

export default { get, upsert };
