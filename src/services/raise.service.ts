import axios from 'axios';
import cheerio from 'cheerio';
import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Markets } from '../models/market.model';
import { delay } from '../utils/generic.utils';
import { CardTypes, GiftCardDocument, GiftCardDTO, GiftCardType } from '../models/giftCard.model';
import giftCardService from '../services/giftCard.service';
import marketService from './market.service';
import { HistoricalRecordDTO } from 'src/models/historicalRecord.model';

// NOTE: Raise Scraper Client
const raiseClient = axios.create({ baseURL: 'https://www.raise.com' });

const getGiftCardKeywords = async () => {
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
const getGiftCardDetails = async (keyword: string): Promise<[any, PaginationDetails]> => {
  try {
    const params = { type: 'paths', keywords: keyword };
    const { data } = await raiseClient.get('/query', { params });

    // const gcData: GiftCardDTO = {
    //   extId: data.id,
    //   name: data.name,
    //   logoUrl: data.src,
    //   type: data.electronic ? CardTypes.DIGITAL : CardTypes.PHYSICAL,
    //   market: Markets.RAISE
    // };

    // await marketService.upsert(gcData);

    // const hrData: HistoricalRecordDTO = {
    //   available: data.available,
    //   quantityAvailable: data.quantity_available,
    //   rating: data.rating,
    //   ratingCount: data.ratingCount,
    //   cashback: data.cashBack,
    //   savings: data.savings,
    //   soldLastDay: data.sellingRate.last_day
    // };

    // console.log('data:', data);

    // const giftCardDTO: GiftCardDTO = {
    //   name: data.name,
    //   logoUrl: data.src,
    // };

    const gcData: {
      keyword: string;
      extId: string;
      name: string;
      logoUrl: string;
      available: boolean;
      quantityAvailable: number;
      rating: string;
      ratingCount: number;
      cashback: string;
      savings: string;
      soldLastDay: number;
    } = {
      keyword,
      extId: data.id,
      name: data.name,
      logoUrl: data.src,
      available: data.available,
      quantityAvailable: data.quantity_available,
      rating: data.rating,
      ratingCount: data.ratingCount,
      cashback: data.cashBack,
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

const logResults = (giftCards: any[]) => {
  try {
    const csv = parse(giftCards);

    const fileName = new Date().toISOString().split('T')[0];
    const filePath = path.resolve(__dirname, `./raise-import-results-${fileName}.csv`);

    fs.writeFileSync(filePath, csv);
  } catch (err) {
    console.error(err);
  }
};

const importGiftCardsJob = async () => {
  const keywords = await getGiftCardKeywords();

  const blacklistFilePath = path.resolve(__dirname, 'blacklistedKeywords.txt');
  const contents = fs.readFileSync(blacklistFilePath, 'utf-8');
  const blacklistedKeywords = new Set(contents.split(/\r?\n/));

  const filteredKeywords = keywords.filter(keyword => !blacklistedKeywords.has(keyword));
  const fufilled = [];
  const rejected = [];

  await Promise.allSettled(
    filteredKeywords.map(async (keyword, idx) => {
      try {
        await delay(idx * 50);

        const giftCard = (await getGiftCardDetails(keyword))[0];
        process.stdout.write(`Importing: ${idx}/${filteredKeywords.length - 1} \r`);

        fufilled.push(giftCard);
        return giftCard;
      } catch (err) {
        rejected.push(keyword);
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

// const testCreate = () => {
//   Mark
// }

importGiftCardsJob();
