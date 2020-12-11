const httpStatus = require('http-status');
const Market = require('models/market.model');
const APIError = require('utils/APIError.utils');
const { addToCache } = require('utils/redis.utils');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const market = await Market.findById(id);

      if (!market) {
        return next(new APIError('Recipe not found', httpStatus.NOT_FOUND));
      }

      addToCache(req, 300, market);
      return res.json(market);
    } catch (err) {
      return next(err);
    }
  }
};
