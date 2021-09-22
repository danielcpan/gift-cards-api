import winston from 'winston';
import expressWinston from 'express-winston';

const expressWinstonLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: true,
  colorize: true
});

export default expressWinstonLogger;
