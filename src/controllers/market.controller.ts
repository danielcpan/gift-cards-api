import { Request, Response, NextFunction as Next } from 'express';
import httpStatus from 'http-status';
import Market, { MarketDocument } from '~/models/market.model';
import APIError from '~/utils/APIError.utils';
import { addToCache } from '~/utils/redis.utils';

interface GetParams {
  marketId: number;
}

// Needs to draw a random one
// const get: API<GetParams> = async (req, res, next) => {
const get = async (req: Request<GetParams>, res: Response<MarketDocument>, next: Next) => {
  try {
    const market = await Market.findOne({ _id: req.params.marketId });

    if (!market) {
      return next(new APIError('Market not found', httpStatus.NOT_FOUND));
    }

    addToCache(req, 300, market);

    return res.json(market);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const markets = await Market.find();

    addToCache(req, 300, markets);

    return res.json(markets);
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const market = new Market(req.body);

    await market.save();

    return res.status(httpStatus.CREATED).json(market);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const market = await Market.findOne({ _id: req.params.id });

    if (!market) {
      return next(new APIError('Market not found', httpStatus.NOT_FOUND));
    }

    market.set(req.body);

    await market.save();

    return res.status(httpStatus.OK).json(market);
  } catch (err) {
    return next(err);
  }
};

export default { get, list, create, update };
