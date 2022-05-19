import Market, { MarketType } from '../models/market.model';

const get = (marketId: string) => {
  try {
    return Market.findById(marketId).populate('giftcards');
  } catch (err) {
    console.error('MarketService Get Error:', err);
  }
};

const list = () => {
  try {
    return Market.find();
  } catch (err) {
    console.error('MarketService List Error:', err);
  }
  return Market.find();
};

const upsert = async (data: MarketType) => {
  try {
    const market = await Market.findOneAndUpdate({ name: data.name }, data, {
      new: true,
      upsert: true,
      populate: 'giftCards'
    });

    return market;
  } catch (err) {
    console.error('MarketService Upsert Error:', err);
  }
};

export default { get, list, upsert };
