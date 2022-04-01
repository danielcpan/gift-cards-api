import axios from 'axios';
import cheerio from 'cheerio';
import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Markets } from '../models/market.model';
import { delay } from '../utils/generic.utils';
import { GiftCardDocument, GiftCardDTO, GiftCardType } from '../models/giftCard.model';
import giftCardService from '../services/giftCard.service';

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

// const getGiftCardDetails = async (id: string): Promise<[GiftCardDTO, PaginationDetails]> => {
const getGiftCardDetails = async (id: string): Promise<[any, PaginationDetails]> => {
  try {
    const params = { type: 'paths', keywords: id };
    const { data } = await raiseClient.get('/query', { params });

    // console.log('data:', data);

    // const giftCardDTO: GiftCardDTO = {
    //   name: data.name,
    //   logoUrl: data.src,
    // };

    const gcData = {
      extId: id,
      name: data.name,
      logoUrl: data.src,
      available: data.available,
      quantityAvailable: data.quantity_available,
      rating: data.rating,
      ratingCount: data.ratingCount,
      cashback: data.cashback,
      savings: data.savings,
      soldLastDay: data.sellingRate.last_day
    };

    const paginationDetails: PaginationDetails = {
      page: data.page,
      perPage: data.perPage,
      totalPages: data.totalPages,
      totalCards: data.totalCards
    };

    // return [giftCardDTO, paginationDetails];
    return [gcData, paginationDetails];
  } catch (err) {
    throw err;
  }
};

const logResults2 = (fufilled: string[], rejected: string[]) => {
  try {
    const csv = parse({ fufilled, rejected });

    const fileName = new Date().toISOString().split('T')[0];

    fs.writeFileSync(path.resolve(__dirname, `./raise-import-results-${fileName}.csv`), csv);
  } catch (err) {
    console.error(err);
  }
};

const logResults = (giftCards: any[]) => {
  try {
    const csv = parse(giftCards);

    const fileName = new Date().toISOString().split('T')[0];

    fs.writeFileSync(path.resolve(__dirname, `./raise-import-results-${fileName}.csv`), csv);
  } catch (err) {
    console.error(err);
  }
};

const importGiftCardsJob = async () => {
  const ids = await getGiftCardIds();

  const contents = fs.readFileSync(path.resolve(__dirname, 'blacklistedIds.txt'), 'utf-8');
  const blacklistedIds = new Set(contents.split(/\r?\n/).map(id => id));

  const filteredIds = ids.filter(id => !blacklistedIds.has(id));
  const fufilled = [];
  const rejected = [];

  await Promise.allSettled(
    filteredIds.map(async (id, idx) => {
      try {
        await delay(idx * 50);

        const giftCard = (await getGiftCardDetails(id))[0];
        console.log('idx:', idx);

        fufilled.push(giftCard);
        return giftCard;
      } catch (err) {
        rejected.push(id);
      }
    })
  );

  console.log('fufilled:', fufilled.length);
  const giftCards = fufilled.filter(
    (el: any) => parseFloat(el.rating) > 0 && el.ratingCount >= 100
  );

  console.log('rejected ids:', rejected);

  logResults(giftCards);
};

importGiftCardsJob();
