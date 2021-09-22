import { Request, Response, NextFunction as Next } from 'express';
import httpStatus from 'http-status';
import GiftCard, { GiftCardDocument } from '~/models/giftCard.model';
import APIError from '~/utils/APIError.utils';
import { addToCache } from '~/utils/redis.utils';

interface GetParams {
  giftCardId: number;
}

// Needs to draw a random one
// const get: API<GetParams> = async (req, res, next) => {
const get = async (req: Request<GetParams>, res: Response<GiftCardDocument>, next: Next) => {
  try {
    const giftCard = await GiftCard.findOne({ _id: req.params.giftCardId });

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

const create = async (req, res, next) => {
  try {
    const giftCard = new GiftCard(req.body);

    await giftCard.save();

    return res.status(httpStatus.CREATED).json(giftCard);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const giftCard = await GiftCard.findOne({ _id: req.params.id });

    if (!giftCard) {
      return next(new APIError('GiftCard not found', httpStatus.NOT_FOUND));
    }

    giftCard.set(req.body);

    await giftCard.save();

    return res.status(httpStatus.OK).json(giftCard);
  } catch (err) {
    return next(err);
  }
};

export default { get, list, create, update };
