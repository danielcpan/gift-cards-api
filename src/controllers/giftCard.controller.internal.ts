import { Listing, Market } from '~/models';
import GiftCard, { GiftCardType } from '~/models/giftCard.model';
import { ListingType } from '~/models/listing.model';
import HistoricalRecord from '~/models/historicalRecord';

const create = async (giftCardData: Pick<GiftCardType, 'name' | 'logoUrl'>) => {
  try {
    let giftCard = await GiftCard.findOne({ name: giftCardData.name });

    // NOTE: Don't raise error if exists
    if (giftCard !== null) return giftCard;

    giftCard = new GiftCard(giftCardData);

    await giftCard.save();

    return giftCard;
  } catch (err) {
    console.error(err);
  }
};

interface UpdateListingsPayload {
  giftCardId: string;
  marketId: string;
  listings: Pick<ListingType, 'type' | 'value' | 'savings'>[];
}

const updateListings = async (payload: UpdateListingsPayload) => {
  const { giftCardId, marketId, listings } = payload;
  const market = await Market.findById(marketId);
  const giftCard = await GiftCard.findById(giftCardId);

  // NOTE: Delete Existing
  await Listing.deleteMany({ giftCard: giftCard.id, market: market.id });

  const listingsData = listings.map(listing => ({
    ...listing,
    giftCard: giftCard.id,
    market: market.id
  }));

  try {
    Listing.collection.insertMany(listingsData, (err, result) => {
      if (err) {
        console.error(err);
      }

      return result;
    });
  } catch (err) {
    console.error(err);
  }
};

const upsertHistoricalRecord = async (marketId: string, giftCardId: string) => {
  try {
    const market = await Market.findById(marketId);
    const giftCard = await GiftCard.findById(giftCardId).populate('listings');

    const data = giftCard.listings.reduce<any>(
      ({ inventory, bestSavings, totalSavings }, el: ListingType) => ({
        inventory: inventory + el.value,
        bestSavings: Math.max(bestSavings, el.savings),
        totalSavings: totalSavings + el.value * (el.savings / 100)
      }),
      { inventory: 0, bestSavings: 0, totalSavings: 0 }
    );

    const today = new Date().toISOString().split('T')[0];

    const historicalRecord = await HistoricalRecord.findOneAndUpdate(
      { date: today },
      {
        date: today,
        quantity: giftCard.listings.length,
        inventory: data.inventory,
        bestSavings: data.bestSavings,
        avgSavings: data.inventory / data.totalSavings,
        giftCard: giftCard.id,
        market: market.id
      },
      { new: true, upsert: true }
    );

    return historicalRecord;
  } catch (err) {
    console.error(err);
  }
};

export default { create, updateListings, upsertHistoricalRecord };
