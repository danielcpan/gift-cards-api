import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compress from 'compression';
import httpStatus from 'http-status';
import routes from './routes';
import expressWinstonLogger from './utils/winston.utils';
import { convertToAPIError, httpError, log } from './utils/error-handler.utils';

import config from '~/config';

const app = express();

// MIDDLEWARE
if (config.ENV === 'developmet') app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());

// ENABLE DETAILED API LOGGING IN DEV ENV
if (config.ENV === 'development') app.use(expressWinstonLogger);

// MOUNT ALL ROUTES ON API
app.use('/api', routes);

// ERROR HANDLING
app.use(convertToAPIError); // IF ERROR IS NOT AN INSTANCE OF APIERROR, CONVERT IT
app.use(httpError(httpStatus.NOT_FOUND)); // CATCH 404 AND FORWARD TO ERROR HANDLER
app.use(log);

export default app;
