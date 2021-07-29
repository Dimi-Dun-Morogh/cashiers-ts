import mysql from 'mysql';
import config from './config';
import { ID, Shop } from './models';
import { logger, fixBracketsJSON, parseSqlJson } from './utils';

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

const Query = async (connection: mysql.Connection, query: string) => new
Promise((resolve, reject) => {
  connection.query(query, connection, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});

const CreateItem = async (table: string, itemObj: Object) => {
  const keys = `(${Object.keys(itemObj).join(', ')})`;
  let values = Object.values(itemObj).reduce(
    (acc, item) => `${acc}"${typeof item === 'object' ? JSON.stringify(item) : item}", `,
    '',
  );
  values = fixBracketsJSON(values);
  const query = `INSERT INTO ${table} ${keys} VALUES (${values.slice(0, -2)})`;
  try {
    const connection = await ConnectDb();
    const newItem = await Query(connection, query);
    logger.info(NAMESPACE, `creating item for table ${table}`, itemObj);
    connection.end();
    return newItem;
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const ReadItems = async (table: string, id?:ID) : Promise<any> => {
  try {
    let queryString = `SELECT * from ${table}`;
    if(id) queryString += ` WHERE id = "${id}"`

    const connection = await ConnectDb();
    const items = await Query(connection, queryString);
    const parsed:[]  = JSON.parse(JSON.stringify(items)).map((item:object)=>parseSqlJson(item))
    logger.info(
      NAMESPACE,
      `reading items from ${table}, query is ${queryString}`,
      parsed,
    );
    connection.end();
    return parsed;
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const UpdateItem = async (
  table: string,
  id: string | number,
  itemObj: Object,
) => {
  try {
    const query = Object.entries(itemObj).reduce(
      (acc, [key, value]) => `${acc}${key} = "${value}", `,
      '',
    );
    const connection = await ConnectDb();
    await Query(
      connection,
      `UPDATE ${table} SET ${query.slice(0, -2)} WHERE id = "${id}"`,
    );
    logger.info(NAMESPACE, `update item ${table}`, itemObj);
    const updated = await Query(
      connection,
      `SELECT  * FROM ${table} WHERE id = ${id}`,
    );
    logger.info(NAMESPACE, 'item updated', JSON.stringify(updated));
    connection.end();
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const DeleteItem = async (table: string, id: string | number) :Promise<any> => {
  try {
    const connection = await ConnectDb();
    const deleted = await Query(
      connection,
      `DELETE from ${table} WHERE id = ${id}`,
    );
    logger.info(NAMESPACE, `deleting id ${id} from ${table}`);
    connection.end();
    logger.info(NAMESPACE, 'delete', deleted);
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const createShop = async(shop: Shop)=>{
  const newShop = await CreateItem('Shop', shop);
  return newShop;
}

const readShop = async(id: ID) => {
  const data = await ReadItems('Shop', id);

  return data;
}

const updateShop = async(id: ID, newShop: Shop) => {
  const data = await UpdateItem('Shop', id, newShop)
  return data;
}


export {
  ConnectDb,
  createShop,
  readShop,
  updateShop
};
