import { Request } from 'express';
import httpStatus from 'http-status';
import { Listing, Market } from '~/models';
import GiftCard, { GiftCardType, GiftCardDocument } from '~/models/giftCard.model';
import { ListingType } from '~/models/listing.model';
import HistoricalRecord, { HistoricalRecordDocument } from '~/models/historicalRecord';
import APIError from '~/utils/APIError.utils';
import { addToCache, Time } from '~/utils/redis.utils';

interface GetParams {
  giftCardId: number;
}

const get = async (req: Request<GetParams>, res, next) => {
  try {
    const giftCard = await GiftCard.findById(req.params.giftCardId)
      .populate('listings')
      .populate('historicalRecords')
      .exec();

    if (!giftCard) {
      return next(new APIError('GiftCard not found', httpStatus.NOT_FOUND));
    }

    addToCache(req, Time.ONE_HOUR, giftCard);

    return res.json(giftCard);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const giftCards = await GiftCard.find();

    addToCache(req, 300, giftCards);

    return res.json(giftCards);
  } catch (err) {
    return next(err);
  }
};

const create = async (
  req: Request<void, GiftCardDocument, Pick<GiftCardType, 'name' | 'logoUrl'>>,
  res,
  next
) => {
  try {
    let giftCard = await GiftCard.findOne({ name: req.body.name });

    // NOTE: Don't raise error if exists
    if (giftCard !== null) {
      return res.status(httpStatus.OK).json(giftCard);
    }

    giftCard = new GiftCard(req.body);

    await giftCard.save();

    return res.status(httpStatus.CREATED).json(giftCard);
  } catch (err) {
    return next(err);
  }
};

interface UpdateListingsParams {
  giftCardId: number;
}
interface UpdateListingsBody {
  marketId: string;
  listings: Pick<ListingType, 'type' | 'value' | 'savings'>[];
}

const updateListings = async (
  req: Request<UpdateListingsParams, void, UpdateListingsBody>,
  res,
  next
) => {
  const market = await Market.findById(req.body.marketId);
  const giftCard = await GiftCard.findById(req.params.giftCardId);

  // NOTE: Delete Existing
  await Listing.deleteMany({ giftCard: giftCard.id, market: market.id });

  const listings = req.body.listings.map(listing => ({
    ...listing,
    giftCard: giftCard.id,
    market: market.id
  }));

  try {
    Listing.collection.insertMany(listings, (err, result) => {
      if (err) return next(err);

      return res.status(httpStatus.CREATED).json(result);
    });
  } catch (err) {
    return next(err);
  }
};

interface UpsertParams {
  giftCardId: number;
}

interface UpsertBody {
  marketId: string;
}

const upsertHistoricalRecord = async (
  req: Request<UpsertParams, HistoricalRecordDocument, UpsertBody>,
  res,
  next
) => {
  try {
    const market = await Market.findById(req.body.marketId);
    const giftCard = await GiftCard.findById(req.params.giftCardId).populate('listings');

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

    return res.status(httpStatus.CREATED).json(historicalRecord);
  } catch (err) {
    return next(err);
  }
};

export default { get, list, create, updateListings, upsertHistoricalRecord };
