/* eslint no-console: 0 */
import server from './server';
import config from './config';
import { connectMongo } from './utils/mongoose.utils';
import { connectRedis } from './utils/redis.utils';

// MONGO DATABASE
// connectMongo();

// REDIS STORE
connectRedis();

server.listen(config.PORT, () => console.log(`🚀 Server ready at ${config.PUBLIC_URL}`));
