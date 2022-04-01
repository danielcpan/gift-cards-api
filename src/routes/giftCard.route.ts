import express from 'express';
import { giftCardCtrl } from '../controllers';
import { checkCache } from '../utils/redis.utils';

const router = express.Router();

router.route('/').get(checkCache, giftCardCtrl.list);
router.route('/:giftCardId').get(checkCache, giftCardCtrl.get);

export default router;
