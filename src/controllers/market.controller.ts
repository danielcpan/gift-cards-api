import { Request, Response, NextFunction as Next } from 'express';
import httpStatus from 'http-status';
import { MarketDocument } from '~/models/market.model';
import marketService from '~/services/market.service';
import APIError from '~/utils/APIError.utils';
import { addToCache } from '~/utils/redis.utils';

interface GetParams {
  marketId: string;
}

const get = async (req: Request<GetParams>, res: Response<MarketDocument>, next: Next) => {
  try {
    const market = await marketService.get(req.params.marketId);

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
    const markets = await marketService.list;

    addToCache(req, 300, markets);

    return res.json(markets);
  } catch (err) {
    return next(err);
  }
};

export default { get, list };
