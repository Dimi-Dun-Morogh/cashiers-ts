import mysql from 'mysql';
import config from './config';
import { logger } from './utils';

const params = {
  user: config.mysql.user,
  password: config.mysql.password,
  host: config.mysql.host,
  database: config.mysql.database,
};

const NAMESPACE = 'db.ts';

const ConnectDb = () => new Promise<mysql.Connection>((resolve, reject) => {
  const connection = mysql.createConnection(params);

  connection.connect((error) => {
    if (error) {
      reject(error);
      logger.error(NAMESPACE, 'error connecting to db', error.message);
      return;
    }
    resolve(connection);
    logger.info(NAMESPACE, 'connect to db success');
  });
});

export {
  ConnectDb,
};
