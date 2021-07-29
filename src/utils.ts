const logger = {
  getTimeStamp: (): string => new Date().toLocaleTimeString(),
  info(namespace: string, message: string, object?: any) {
    if (object) {
      console.log(
        `[${this.getTimeStamp()}] [INFO] [${namespace}] [${message}]`,
        object,
      );
    } else {
      console.log(
        `[${this.getTimeStamp()}] [INFO] [${namespace}] [${message}]`,
      );
    }
  },
  error(namespace: string, message: string, object?: any) {
    if (object) {
      console.error(
        `[${this.getTimeStamp()}] [ERROR] [${namespace}] [${message}]`,
        object,
      );
    } else {
      console.error(
        `[${this.getTimeStamp()}] [ERROR] [${namespace}] [${message}]`,
      );
    }
  },
};

/*  '("55", "female", "33", "{"somecrap":["rrr","xxx"]}", "Red lady")'  -- replace " before { with '
 */
const fixBracketsJSON = (query: string): string => {
  let fixed = '';
  for (let i = 0; i < query.length; i += 1) {
    if (query[i + 1] === '[' || query[i - 1] === ']') {
      fixed += "'";
    } else {
      fixed += query[i];
    }
  }
  return fixed;
};

function IsJsonString(str:string) {
  try {
    var json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

/* parseSqlJson
{
  id: 1,
...
  cashiers: '[1, 2]'
} ===> {
  id: 1,
...
  cashiers: [1, 2]
}
*/
const parseSqlJson = (sqlData: object)=> {
  if(!sqlData) return sqlData;
  const data = Object.entries(sqlData)
  .map(([key,value])=>{
    let newVal = value;
    if(typeof value === 'string'){
      const isValidJSON = IsJsonString(value);
      if(isValidJSON) newVal = JSON.parse(value)
    }
    return [key, newVal]
  })
  return Object.fromEntries(data)
}

export {
  logger,
  fixBracketsJSON,
  parseSqlJson
};
