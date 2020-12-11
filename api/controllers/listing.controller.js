const httpStatus = require('http-status');
const Listing = require('models/listing.model');
const APIError = require('utils/APIError.utils');
const { addToCache } = require('utils/redis.utils');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const listing = await Listing.findById(id);

      if (!listing) {
        return next(new APIError('Recipe not found', httpStatus.NOT_FOUND));
      }

      addToCache(req, 300, listing);
      return res.json(listing);
    } catch (err) {
      return next(err);
    }
  }
};
