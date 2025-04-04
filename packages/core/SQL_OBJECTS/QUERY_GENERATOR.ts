import { CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS } from "../../helpers/convertObjectToQuery";
// import SQL_BASE from "./SQL_BASE";
// import SQL_ROW from "./SQL_ROW";

import {
  Key,
  Row,
  Schema,
  ColumnInput,
  ColumnName,
  Value,
  Messenger,
  ForeignKeyValuePair,
  ForeignKeyMap,
  Options,
  PrimaryKey,
  RowEntry,
  Rows
} from "../../type_defs/SQL_TYPES";

import ARGS from "../../helpers/postgreArgs";

class QUERY_GENERATOR {
    HANDLE_INSERT_NUMBER_OR_STRING = (value: Value, quote: string) => {
        if (typeof value == "string"){
          return `${quote}${value}${quote}`
        } else if (typeof value == "number"){
          return value
        } else {
          return value
        }
      }
    
    HANDLE_INSERT_ARRAY = (array: Array<string|number>) => {
        const newArray = array.map((item) => {
          if (Array.isArray(item)){
            return this.HANDLE_INSERT_ARRAY(item)
          } else {
            return this.HANDLE_INSERT_NUMBER_OR_STRING(item, `'`)
          }
        })
    
        let sqlArray = "'{"
        sqlArray += newArray.join(",")
        sqlArray += "}'"
        return sqlArray
      }
    
    HANDLE_INSERT_JSON_B = (object: {}) => {
        return `'${JSON.stringify(object)}'::jsonb`
      }
    
    
    HANDLE_INSERT_ARRAY_DATA = (array: any[], quote: string, jsonColumns: number[] | undefined = undefined) => {
        let string = ""
        array.forEach((value, index) => {
          if (jsonColumns && Array.isArray(jsonColumns) && jsonColumns.includes(index)){
            string += this.HANDLE_INSERT_JSON_B(value)
          }
          
          else if (Array.isArray(value)){
            string += this.HANDLE_INSERT_ARRAY(value)
          } else {
            string += this.HANDLE_INSERT_NUMBER_OR_STRING(value, quote)
          }
          if (index !== array.length - 1){
            string += ', '
          }
        })
        return string
      }
      
    HANDLE_ARRAY_COLUMN_VALUES = (rowColumnValue: Value | Value[]) => {
        if (Array.isArray(rowColumnValue)){
          const values = rowColumnValue.map((value: any) => {
            if ( value && typeof value === "string" && !Number.isNaN(Number(value))){
              return Number(value)
            } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean"){
              return this.HANDLE_INSERT_NUMBER_OR_STRING(value, `'`)
            } else {
              if (value){
                return value
              } else {
                throw Error(`Cannot Interpret Column Value Of Type ${typeof value}`)
              }
            }
          })
          return values
        } else {
          return rowColumnValue
        }
      } 
    
    SELECT_ALL = () => {
      return "SELECT * ";
    };

    FROM_TABLE = (tableName: string) => {
      return `FROM ${tableName} `;
    };
    
    TableWhere = (columnName: ColumnName, tableName: string, value: Value) => {
        let val = value;
        if (typeof val == "string") {
          val = `'${value}'`;
        }
        return `"${columnName}" = '${tableName}'.${val}`;
    };
    
    
    Where = (columnName: ColumnName, value: Value) => {
      let val = value;
      if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
        val = this.HANDLE_INSERT_NUMBER_OR_STRING(val, `'`)
      } else if (Array.isArray(val)){
        val = this.HANDLE_ARRAY_COLUMN_VALUES(val)
      } 
      return `"${columnName}" = ${val} `;
    };
    
    Wheres = (args: ColumnInput) => {
        let query = "WHERE ";
        const entries = Object.entries(args);
        entries.forEach((entry, index) => {
          const addend = index === entries.length - 1 ? "" : "AND ";
          query += this.Where(entry[0], entry[1]) + addend;
        });
        return query;
      };
}



export class SQL_HELPERS {
  IS_JSON = (potentialJsonString: string) => {
    try {
      return JSON.parse(potentialJsonString)
      
    } catch (err) {
      return false
    }
  }

  compareAllColumnInputs = (arr: ColumnInput[]) => {
    let colNames = [];
    let colVals = [];
    for (let i = 0; i < arr.length; i++) {
      const [key, value] = Object.entries(arr[i]);
      colNames.push(key);
      colVals.push(value);
    }

    let text = "";
    for (let i = 0; i < colNames.length; i++) {
      const col = colNames[i];
      const value = colVals[i];
      const addend = i === colNames.length - 1 ? "" : "AND";
      text += `"${col}" = '${value}' ${addend} `;
    }
    return text;
  };

getPrimaryKey = (tableSchema: Schema) => {
  let primaryKey = "";
        
  for (let {column, params} of tableSchema){
      if (ARGS.primaryKey in params){
          primaryKey = column;
          break;
      }
  }

  if (primaryKey == ""){
      throw Error("Primary Key Could Not Be Found In Schema: " + JSON.stringify(tableSchema));
  }
  return primaryKey;
}
  
}


export default QUERY_GENERATOR
