import { Request } from 'express';
import httpStatus from 'http-status';
import GiftCard from '~/models/giftCard.model';
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

export default { get, list };
