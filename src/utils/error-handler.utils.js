import expressValidation from 'express-validation';
import APIError from './APIError.utils';
import config from '~/config';

// TODO: Convert to TS
export const convertToAPIError = (err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const validationError = new APIError(unifiedErrorMessage, err.status, true);

    return next(validationError);
  }

  if (!(err instanceof APIError)) {
    return next(new APIError(err.message, err.status));
  }

  return next(err);
};

export const httpError = errorCode => (req, res, next) => {
  return next(new APIError('API not found', errorCode));
};

export const log = (err, req, res, next) => {
  res.status(err.status || 500).json({
    name: err.name,
    message: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : {}
  });
};
