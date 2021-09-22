const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.raise.com';

const getGiftCardIds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/gift-card-balance`);

    const $ = cheerio.load(response.data, { xml: { normalizeWhitespace: true } });

    const ids: string[] = Array.from($('[href*="/gift-card-balance-check/"]')).map((el: any) => {
      return el.attribs.href.split('/').pop();
    });

    return ids;
  } catch (err) {
    console.error(err);
  }
};

const getGiftCardDetails = async (id: string) => {
  try {
    const params = { type: 'paths', keywords: id };
    const data = (await axios.get(`${BASE_URL}/query`, { params })).data;

    const giftCard = {
      name: data.name,
      logoUrl: data.src,
      rating: data.rating,
      ratingCount: data.ratingCount,
      quantity: data.quantity_available,
      savings: parseFloat(data.savings),
      cardType: data.physical ? 'PHYSICAL' : 'DIGITAL'
    };

    return giftCard;
  } catch (err) {
    console.error(err);
  }
};

getGiftCardIds().then(brands => {
  getGiftCardDetails(brands![0]).then(brand => {
    console.log('brand:', brand);
  });
});
