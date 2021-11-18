import redis from 'redis';
import { promisify } from 'util';
import httpStatus from 'http-status';
import config from '../config';

const client = redis.createClient();

const getAsync = promisify(client.get).bind(client);

export const buildKey = req => req.originalUrl.replace('/api/', '').replace('/', ':');

export const connectRedis = () => {
  client.on('connect', () => console.log('Redis Connection Succesful'));
  client.on('error', err => console.log(`Redis Connection Error ${err}`));
};

export const checkCache = async (req, res, next) => {
  if (config.ENV === 'test') return next();

  const key = buildKey(req);

  try {
    const cachedData = await getAsync(key);

    if (!cachedData) {
      if (config.ENV === 'development') console.log('NO CACHED DATA');
      return next();
    }

    if (config.ENV === 'development') console.log('WE GOT CACHED DATA FROM REDIS');

    return res.status(httpStatus.OK).json(JSON.parse(cachedData));
  } catch (err) {
    if (config.ENV === 'development') console.log(`REDIS ERROR ${err}`);
    return next();
  }
};

export enum Time {
  FIVE_MINUTES = 60 * 5,
  THIRTY_MINUTES = 60 * 30,
  ONE_HOUR = 60 * 60
}

export const addToCache = (req, expirationTime = Time.FIVE_MINUTES, value) => {
  if (config.ENV === 'test') return;

  const key = buildKey(req);

  if (config.ENV === 'development') {
    client.setex(key, 15, JSON.stringify(value));
  } else {
    client.setex(key, expirationTime, JSON.stringify(value));
  }
};
