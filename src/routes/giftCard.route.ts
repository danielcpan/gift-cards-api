import express from 'express';
import { giftCardController } from '~/controllers';
import { checkCache } from '~/utils/redis.utils';

const router = express.Router();

router.route('/').get(checkCache, giftCardController.list).post(giftCardController.create);

router.route('/:giftCardId').get(checkCache, giftCardController.get);

router.route('/updateListings/:giftCardId').put(giftCardController.updateListings);

export default router;
