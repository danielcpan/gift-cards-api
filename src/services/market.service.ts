import Market from '~/models/market.model';

const get = (marketId: string) => {
  return Market.findById(marketId);
};

const list = () => {
  return Market.find();
};

export default { get, list };
