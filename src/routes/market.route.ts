import express from 'express';
import { marketController } from '~/controllers';
import { checkCache } from '~/utils/redis.utils';

const router = express.Router();

router.route('/').get(checkCache, marketController.list).post(marketController.create);

router.route('/:marketId').get(checkCache, marketController.get).put(marketController.update);

export default router;
