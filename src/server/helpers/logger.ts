/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from 'winston';
import * as winston from 'winston';

const { combine, timestamp, colorize, printf, json } = winston.format;

const customFormat: any = printf((info: any) => {
  return `[${info.timestamp}][${info.level}] ${info.message}`;
});

// NOTE: Log only less than or equal to this level (log level)
// LOG_LEVEL is setting when webpack build time
const customLogger: Logger = winston.createLogger({
  level: 'LOG_LEVEL',
  levels: {
    log: 0, // log always displayed
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    colorize(),
    json(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console({
      level: 'LOG_LEVEL',
    }),
  ],
});
winston.addColors({
  log: 'grey',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
});

const formatObject: Function = (param: any): string => {
  const type: any = typeof param;

  if (type === 'object' || type === 'function') {
    try {
      return JSON.stringify(param, null, 2);
    } catch (e) {
      const cache: Set<any> = new Set();
      return JSON.stringify(
        param,
        (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
              // Circular reference found
              try {
                // If this value does not reference a parent it can be deduped
                return JSON.parse(JSON.stringify(value));
              } catch (err) {
                // discard key if value cannot be deduped
                return '';
              }
            }
            // Store value in our set
            cache.add(value);
          }
          return value;
        },
        2,
      );
    }
  }
  return param;
};

const createLogContent: Function = (...args: any[]): string => {
  let data = '';
  if (args.length === 1) {
    return args[0];
  }
  if (args.length > 1) {
    args.forEach((logData: any, index: number) => {
      if (index === 0) {
        data += formatObject(logData);
        return;
      }
      data += `, ${formatObject(logData)}`;
    });
  }

  return data;
};

// support multiple arguments e.g) logger.debug('arg1', 'arg2', 'arg3')
const logger: any = {
  log: async (...args: any[]) => {
    customLogger.log('log', createLogContent(...args));
  },
  error: async (...args: any[]) => {
    customLogger.error(createLogContent(...args));
    // TODO: implements sen nelo log
  },
  warn: async (...args: any[]) => {
    customLogger.warn(createLogContent(...args));
  },
  info: async (...args: any[]) => {
    customLogger.info(createLogContent(...args));
  },
  debug: async (...args: any[]) => {
    customLogger.debug(createLogContent(...args));
  },
};

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
