import app from './app';
import logger from './helpers/logger';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const PORT = 3131;

app.listen(PORT, () => {
  logger.log('----------------------------------------------------------');
  logger.log(`Server is running at http://127.0.0.1:${PORT}`);
  logger.log('Press CTRL-C to stop');
  logger.log('----------------------------------------------------------');
  logger.log('Current Log Level is "LOG_LEVEL" Show follow Log Levels...');
  logger.log('log...0');
  logger.error('error...1');
  logger.warn('warn....2');
  logger.info('info....3');
  logger.debug('debug...4');
  logger.log('----------------------------------------------------------');
});
