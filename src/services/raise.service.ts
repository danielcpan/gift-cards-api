import axios from 'axios';
import cheerio from 'cheerio';
import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Markets } from '~/models/market.model';
import { delay } from '~/utils/generic.utils';
import { GiftCardDocument, GiftCardDTO, GiftCardType } from '~/models/giftCard.model';
import giftCardService from '~/services/giftCard.service';

// NOTE: Raise Scraper Client
const raiseClient = axios.create({ baseURL: 'https://www.raise.com' });

const getGiftCardIds = async () => {
  try {
    const response = await raiseClient.get('/gift-card-balance');

    const $ = cheerio.load(response.data, { xml: { normalizeWhitespace: true } });

    const ids: string[] = Array.from($('[href*="/gift-card-balance-check/"]')).map((el: any) => {
      return el.attribs.href.split('/').pop();
    });

    return ids;
  } catch (err) {
    console.error(err);
  }
};

type PaginationDetails = {
  page: number;
  perPage: number;
  totalCards: number;
  totalPages: number;
};

const getListings = async (giftCardId: string, { page, totalCards }: PaginationDetails) => {
  try {
    const response = await raiseClient.get(`/merchant/listings/${giftCardId}/${page}`, {
      params: {
        discount_sort: 'desc',
        per: totalCards,
        price_min: 5,
        price_max: 2000
      }
    });

    return response.data.map(el => ({
      type: el.electronic ? 'DIGITAL' : 'PHYSICAL',
      value: el.value,
      savings: parseFloat(el.discount)
    }));
  } catch (err) {
    console.error(err);
  }
};

const getGiftCardDetails = async (id: string): Promise<[GiftCardDTO, PaginationDetails]> => {
  try {
    const params = { type: 'paths', keywords: id };
    const data = (await raiseClient.get('/query', { params })).data;

    const giftCardDTO: GiftCardDTO = {
      name: data.name,
      logoUrl: data.src
    };

    const paginationDetails: PaginationDetails = {
      page: data.page,
      perPage: data.perPage,
      totalPages: data.totalPages,
      totalCards: data.totalCards
    };

    return [giftCardDTO, paginationDetails];
  } catch (err) {
    throw err;
  }
};

const logResults = (fufilled: string[], rejected: string[]) => {
  try {
    const csv = parse({ fufilled, rejected });

    const fileName = new Date().toISOString().split('T')[0];

    fs.writeFileSync(path.resolve(__dirname, `./raise-import-results-${fileName}.csv`), csv);
  } catch (err) {
    console.error(err);
  }
};

const importGiftCardsJob = async () => {
  const ids = await getGiftCardIds();

  const [fufilled, rejected] = [[], []];
  await Promise.allSettled(
    ids.slice(0, 10).map(async (id, idx) => {
      await delay(idx * 50);

      try {
        const [giftCardDetails, paginationDetails] = await getGiftCardDetails(id);

        // NOTE: Create gift card if doesn't exist
        const giftCard = await giftCardService.create(giftCardDetails);

        const listings = await getListings(giftCard.id, paginationDetails);

        // NOTE: Import listings
        await giftCardService.updateListings({
          giftCardId: giftCard.id,
          marketId: Markets.RAISE,
          listings
        });

        fufilled.push(giftCard.id);
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

  console.error('rejected:', rejected);

  logResults(fufilled, rejected);
};

importGiftCardsJob();
