import marketService from './market.service';
import { MarketType, Markets } from '../models/market.model';
import { CardTypes, GiftCardDTO } from '../models/giftCard.model';
import giftCardService from './giftCard.service';

const seed = async () => {
  const RAISE_MARKET_DATA: MarketType = {
    name: Markets.RAISE,
    logoUrl:
      'https://play-lh.googleusercontent.com/dfhCqg-qzBaeOJbNAfYhB20j9GLNQmopEHa2bmjr4DmJ4mUzGRpKszSiu0lf0WPpsMQ=s180-rw',
    url: 'https://www.raise.com/',
    warranty: 365
  };

  const market = await marketService.upsert(RAISE_MARKET_DATA);

  console.log('market:', market);

  const giftCardTestData: GiftCardDTO = {
    extId: 'Test-Gift-Card',
    name: 'Test Gift Card',
    logoUrl: 'https://www.raise.com/',
    type: CardTypes.DIGITAL,
    market: market._id
  };

  const giftCard = await giftCardService.upsert(giftCardTestData);

  console.log('giftCard:', giftCard);

  // market.giftCards.push(giftCard._id);
  market.giftCards.addToSet(giftCard._id);

  market.save();

  const originalMarket = await marketService.get(market._id);

  console.log('originalMarket:', originalMarket);
};

export default { seed };
