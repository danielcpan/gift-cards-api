import express from 'express';
import { marketCtrl } from '~/controllers';
import { checkCache } from '~/utils/redis.utils';

const router = express.Router();

router.route('/').get(checkCache, marketCtrl.list);
router.route('/:marketId').get(checkCache, marketCtrl.get);

export default router;
