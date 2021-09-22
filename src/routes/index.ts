import express from 'express';
import giftCardRoutes from './giftCard.route';
import marketRoutes from './market.route';

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/giftCards', giftCardRoutes);
router.use('/markets', marketRoutes);

export default router;
