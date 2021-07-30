import { Filters, ID } from "./models";

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

/** parseSqlJson
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
/**
 * not gonna work for json
 * @param filters object like { id:1 ,sex: "female", yearsOfExperience: 3}
 * @returns string WHERE id = "1" AND sex = "female" AND yearsOfExperience = "3"
 */
const stringifyQueryFilter = (filters:Filters):string|null=> {
  if(!filters) return null;

  let newStr = Object.entries(filters).reduce((acc,[key,value])=>{
    acc+=` AND ${key} = "${value}"`
    return acc;
  }, '')
  return  newStr.replace('AND', 'WHERE')
}

const jsonQueryFilter = (filters: Filters) :string =>{
  const [cellName, fltr] = Object.entries(filters)[0];
  return `json_contains (${cellName}, '"${fltr}"')`
}

export {
  logger,
  fixBracketsJSON,
  parseSqlJson,
  stringifyQueryFilter,
  jsonQueryFilter
};
