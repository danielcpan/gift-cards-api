const httpStatus = require('http-status');
const GiftCard = require('models/giftCard.model');
const APIError = require('utils/APIError.utils');
const { addToCache } = require('utils/redis.utils');

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const giftCard = await GiftCard.findById(id);

      if (!giftCard) {
        return next(new APIError('Recipe not found', httpStatus.NOT_FOUND));
      }

      addToCache(req, 300, giftCard);
      return res.json(giftCard);
    } catch (err) {
      return next(err);
    }
  }
};
