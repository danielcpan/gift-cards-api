import { Request } from 'express';
import httpStatus from 'http-status';
import { Listing, Market } from '~/models';
import GiftCard, { GiftCardType, GiftCardDocument } from '~/models/giftCard.model';
import { ListingDocument, ListingType } from '~/models/listing.model';
import APIError from '~/utils/APIError.utils';
import { addToCache } from '~/utils/redis.utils';

interface GetParams {
  giftCardId: number;
}

const get = async (req: Request<GetParams>, res, next) => {
  try {
    const giftCard = await GiftCard.findById(req.params.giftCardId);

    if (!giftCard) {
      return next(new APIError('GiftCard not found', httpStatus.NOT_FOUND));
    }

    addToCache(req, 300, giftCard);

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

export default { get, list, create, updateListings };

// api/giftCards/home-depot
