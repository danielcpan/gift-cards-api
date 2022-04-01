import GiftCard, { GiftCardDTO } from '../models/giftCard.model';
import Listing, { ListingType, ListingDTO } from '../models/listing.model';
import Market from '../models/market.model';
import HistoricalRecord from '../models/historicalRecord';

const get = (giftCardId: string) => {
  return GiftCard.findById(giftCardId).populate('listings').populate('historicalRecords').exec();
};

const list = () => {
  return GiftCard.find();
};

const create = async (data: GiftCardDTO) => {
  let giftCard = await GiftCard.findOne({ name: data.name });

  // NOTE: Don't raise error if exists
  if (giftCard !== null) return giftCard;

  giftCard = new GiftCard(data);

  await giftCard.save();

  return giftCard;
};

interface UpdateListingsPayload {
  giftCardId: string;
  marketId: string;
  listings: ListingDTO[];
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

  Listing.collection.insertMany(listingsData, (err, result) => {
    if (err) throw err;

    return result;
  });
};

const upsertHistoricalRecord = async (marketId: string, giftCardId: string) => {
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

  // NOTE: Ignores time values. We only care about date.
  const today = new Date(new Date().toISOString().split('T')[0]);

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
};

export default { get, list, create, updateListings, upsertHistoricalRecord };
