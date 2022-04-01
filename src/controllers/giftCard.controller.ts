import { Request } from 'express';
import httpStatus from 'http-status';
import giftCardService from '../services/giftCard.service';
import APIError from '../utils/APIError.utils';
import { addToCache, Time } from '../utils/redis.utils';

interface GetParams {
  giftCardId: string;
}

const get = async (req: Request<GetParams>, res, next) => {
  try {
    const giftCard = await giftCardService.get(req.params.giftCardId);

    if (!giftCard) {
      return new APIError('GiftCard not found', httpStatus.NOT_FOUND);
    }

    addToCache(req, 300, giftCard);

    return res.json(giftCard);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const giftCards = await giftCardService.list();

    addToCache(req, 300, giftCards);

    return res.json(giftCards);
  } catch (err) {
    return next(err);
  }
};

export default { get, list };
