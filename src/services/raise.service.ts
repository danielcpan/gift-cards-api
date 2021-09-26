import axios from 'axios';
import cheerio from 'cheerio';
import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const delay = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

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
      logoUrl: data.src
      // rating: data.rating,
      // ratingCount: data.ratingCount,
      // quantity: data.quantity_available,
      // savings: parseFloat(data.savings),
      // cardType: data.physical ? 'PHYSICAL' : 'DIGITAL'
    };

    return giftCard;
  } catch (err) {
    throw err;
  }
};

const run = async () => {
  const ids = await getGiftCardIds();

  const [fufilled, rejected] = [[], []];
  await Promise.allSettled(
    ids.map(async (id, idx) => {
      await delay(idx * 50);

      try {
        const giftCard = await getGiftCardDetails(id);
        fufilled.push(giftCard);
        return giftCard;
      } catch (err) {
        rejected.push(id);
        console.error(`\t ${err.message}`);
      } finally {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Importing ${idx}/${ids.length}... [ Failed: ${rejected.length} ]`);
      }
    })
  );

  console.log('rejected:', rejected);

  try {
    const csv = parse(fufilled);

    const fileName = new Date().toISOString().split('T')[0];

    fs.writeFileSync(path.resolve(__dirname, `./raise-${fileName}.csv`), csv);
  } catch (err) {
    console.error(err);
  }
};

run();
