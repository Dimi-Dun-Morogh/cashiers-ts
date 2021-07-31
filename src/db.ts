/* eslint-disable max-classes-per-file */
import mysql from 'mysql';
import config from './config';
import {
  Cashier, CashRegister, Filters, ID, Shop, WorkingSchedule,
} from './models';
import {
  logger, fixBracketsJSON, parseSqlJson, stringifyQueryFilter, jsonQueryFilter,
} from './utils';

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
    await Query(connection, query);
    logger.info(NAMESPACE, `creating item for table ${table}`, itemObj);
    connection.end();
    return itemObj;
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

/**
 * ReadItems
 * @param table
 * @param filters object, dont try to filter json with it
 * @param jsonFilter object ex {worksInShifts: 'dayShift'} =>json_contains (worksInShifts,
 * '"dayShift"')
 * @returns
 */
const ReadItems = async (table: string, filters?: Filters, jsonFilter?: Filters) : Promise<any> => {
  try {
    let queryString = `SELECT * from ${table}`;

    if (filters) queryString += ` ${stringifyQueryFilter(filters)}`;
    if (jsonFilter) {
      queryString += `${filters ? ' AND' : 'WHERE'} ${jsonQueryFilter(jsonFilter)}`;
    }

    const connection = await ConnectDb();
    const items = await Query(connection, queryString);
    const parsed:[] = JSON.parse(JSON.stringify(items)).map((item:object) => parseSqlJson(item));
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
    let query = Object.entries(itemObj).reduce(
      (acc, [key, value]) => `${acc}${key} = "${typeof value === 'object' ? JSON.stringify(value) : value}", `,
      '',
    );
    query = fixBracketsJSON(query);
    const connection = await ConnectDb();
    await Query(
      connection,
      `UPDATE ${table} SET ${query.slice(0, -2)} WHERE id = "${id}"`,
    );
    logger.info(NAMESPACE, `update item ${table} query is ${query}`, itemObj);
    const updated = await Query(
      connection,
      `SELECT  * FROM ${table} WHERE id = ${id}`,
    );
    logger.info(NAMESPACE, 'item updated', JSON.stringify(updated));
    connection.end();
    return updated;
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
    return deleted;
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
  }
};

class CustomCRUD <T> {
  readonly tableName:string = '';

  constructor(table:string) {
    this.tableName = table;
  }

  async create(newItem: T):Promise<unknown> {
    const data = await CreateItem(this.tableName, newItem);
    return data;
  }

  /**
   *
 * @param filters object, dont try to filter json with it
 * @param jsonFilters object ex {worksInShifts: 'dayShift'} =>json_contains (worksInShifts,
 * '"dayShift"')
   */

  async read(filters?:Filters, jsonFilters?: Filters):Promise<T[] | []> {
    const data = await ReadItems(this.tableName, filters, jsonFilters);
    return data;
  }

  async update(id:ID, newItem: T) :Promise<unknown> {
    const data = await UpdateItem(this.tableName, id, newItem);
    return data;
  }

  async delete(id: ID):Promise<T[]> {
    const data = await DeleteItem(this.tableName, id);
    return data;
  }
}

const ShopCRUD = new CustomCRUD<Shop>('Shop');
const CashRegCRUD = new CustomCRUD<CashRegister>('CashRegister');
const WorkScheduleCRUD = new CustomCRUD<WorkingSchedule>('workingSchedule');

class CashierCustomCRUD extends CustomCRUD<Cashier> {
  readonly tableName2:string;

  constructor(table:string, table2:string) {
    super(table);
    this.tableName2 = table2;
  }

  async hireCashier(cashierId: ID, shopId: ID) {
    const data = await CreateItem(this.tableName2, { cashierId, shopId });
    return data;
  }

  async fireCashier(cashierId: ID, shopId: ID) {
    try {
      const connection = await ConnectDb();
      await Query(
        connection,
        `DELETE from ${this.tableName2} WHERE cashierId = ${cashierId}`,
      );
      connection.end();
      const cashier = await this.read({ id: cashierId });
      let { pastWorks } = cashier[0];
      if (!Array.isArray(pastWorks)) pastWorks = [];
      if (!pastWorks.includes(+shopId)) pastWorks.push(+shopId);
      const updated = await this.update(cashierId, { ...cashier[0], pastWorks });
      return updated;
    } catch (error) {
      logger.error(NAMESPACE, 'error fireCashier', error.message);
    }
  }

  static async getTargetCashiers1() {
    try {
      const connection = await ConnectDb();
      let neededShopIds = await Query(connection, `SELECT id from Shop where name = "Arsen" or name = "Silpo"
      `).then((data) => JSON.parse(JSON.stringify(data)));
      neededShopIds = neededShopIds.reduce((acc:string, { id } : { [key:string]:number },
        index:number) => {
        let res = acc;
        res += ` ${index === 0 ? 'and' : 'or'} json_contains(pastWorks,'${id}')`;
        return res;
      }, '');

      const targetedCashiers = await Query(connection, `SELECT * from cashier where id in (SELECT cashierId from CashiersInShops where shopId in (SELECT id from Shop WHERE name = "ATB" AND city = "Lviv")
      ) and yearsOfExperience >= 5 ${neededShopIds}`);

      connection.end();
      const parsed:[] = JSON.parse(JSON.stringify(targetedCashiers))
        .map((item:object) => parseSqlJson(item));

      return parsed;
    } catch (error) {
      logger.error(NAMESPACE, 'error getTargetCashiers1', error.message);
    }
  }

  static async getTargetCashiers2() {
    try {
      const connection = await ConnectDb();
      const data = await Query(connection, ` SELECT * from cashier WHERE id in (SELECT cashierId from (SELECT CashRegister.number, workingSchedule.dayOfTheWeek, workingSchedule.shiftName, workingSchedule.shopId, workingSchedule.cashierId
        from CashRegister JOIN workingSchedule ON CashRegister.id =  workingSchedule.cashRegisterId ) as B WHERE shopId in (SELECT id from Shop where name = 'ATB' and address = 'Shevenka  100')
         AND dayOfTheWeek = 'Monday' AND mod(number,2) <> 0 )`);

      const parsed:[] = JSON.parse(JSON.stringify(data))
        .map((item:object) => parseSqlJson(item));

      return parsed;
    } catch (error) {
      logger.error(NAMESPACE, 'error getTargetCashiers2', error.message);
    }
  }
}

const CashierCRUD = new CashierCustomCRUD('cashier', 'CashiersInShops');

export {
  CashierCRUD,
  ShopCRUD,
  CashRegCRUD,
  WorkScheduleCRUD,
  CashierCustomCRUD,
};
