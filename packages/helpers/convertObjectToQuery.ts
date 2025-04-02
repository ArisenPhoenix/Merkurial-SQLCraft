// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// import { TitleFy } from "@helpers/text";
import { TitleFy } from "./text";

interface ForeignKeyReference {
  table: string;
  column: string;
}

type ColumnOptions = string[];

const filterByDate = (startDate: string, endDate: string): string => {
  return `AND date >= ('${startDate} 00:00:00'::date) AND date <= ('${endDate} 00:00:00'::date) `;
};

// const CREATE_TABLE_FUNC = (
//   name: string,
//   objOfColumnsAndOptions: Record<string, ColumnOptions>,
//   foreign: ForeignKeyReference[] = [{ table: "", column: "" }],
//   startingText: string
// ): string => {
//   if (typeof name !== "string") {
//     throw new TypeError("You must add a name for the table to be created");
//   } else if (typeof objOfColumnsAndOptions === "undefined") {
//     throw new TypeError("You must add a valid columns/options object");
//   }

//   const obj = objOfColumnsAndOptions;
//   const objKeys = Object.keys(obj);
//   let primary: string = "";
//   let foreignKeyWord: string[] = [];
//   let text = `${startingText} "${name}" (`;

//   for (let key = 0; key < objKeys.length; key++) {
//     const currentKey = objKeys[key];
//     text += `"${currentKey}" `;
//     const keyData = obj[currentKey];

//     for (let k2 = 0; k2 < keyData.length; k2++) {
//       const current = keyData[k2];
//       if (current.toUpperCase() === "PRIMARY KEY") {
//         primary = currentKey.trim();
//       } else if (current.toUpperCase() === "FOREIGN KEY") {
//         foreignKeyWord.push(currentKey.trim());
//         text += " ";
//       } else {
//         text += current.trim() + " ";
//       }

//       if (k2 === keyData.length - 1) {
//         text = text.trim() + ", ";
//       }
//     }
//   }

//   let primaryKey = `PRIMARY KEY ("${primary}")`;
//   text += primaryKey;

//   if (foreignKeyWord.length > 0) {
//     foreignKeyWord.forEach((foreigner, index) => {
//       text += `, FOREIGN KEY ("${foreigner}") REFERENCES ${foreign[index].table}(${foreign[index].column})`;
//     });
//   }

//   text += ");";
//   return text;
// };


import { Schema, ForeignKeyMap } from "@typedefs/SQL_TYPES";

const createTableObjFromSchema = (schema: Schema): Record<string, string[]> => {
  const obj: Record<string, string[]> = {};
  for (const entry of schema) {
    obj[entry.column] = entry.params;
  }
  return obj;
};

const CREATE_TABLE_FUNC = (
  name: string,
  tableSchema: Schema,
  foreignKeys: ForeignKeyMap = null,
  startingText: string
): string => {
  if (typeof name !== "string") {
    throw new TypeError("You must add a name for the table to be created");
  } else if (!tableSchema) {
    throw new TypeError("You must add a valid schema");
  }

  const obj = createTableObjFromSchema(tableSchema);
  const objKeys = Object.keys(obj);
  let primary: string | undefined;
  let foreignKeyText = "";
  let text = `${startingText} "${name}" (`;

  for (const currentKey of objKeys) {
    const keyData = obj[currentKey];
    text += `"${currentKey}" `;

    for (let i = 0; i < keyData.length; i++) {
      const arg = keyData[i].trim().toUpperCase();

      if (arg === "PRIMARY KEY") {
        if (primary) throw new Error("SQL Tables May Only Have One Primary Key");
        primary = currentKey;
      } else if (arg === "FOREIGN KEY" && foreignKeys) {
        const fk = foreignKeys[currentKey];
        if (fk) {
          const fkText = `FOREIGN KEY ("${currentKey}") REFERENCES ${fk.table}(${fk.columnName})`;
          foreignKeyText += (foreignKeyText ? ", " : ", ") + fkText;
        }
      } else {
        text += keyData[i].trim() + " ";
      }

      if (i === keyData.length - 1) {
        text = text.trim() + ", ";
      }
    }
  }

  if (!primary) throw new Error("A PRIMARY KEY is required for table creation");

  text += `PRIMARY KEY ("${primary}")`;
  text += foreignKeyText;
  text += ");";

  return text;
};

export const CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS = (
  name: string,
  tableSchema: Schema,
  foreignKeys: ForeignKeyMap = null
): string => {
  return CREATE_TABLE_FUNC(name, tableSchema, foreignKeys, "CREATE TABLE IF NOT EXISTS");
};


// export const CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS = (
//   name: string,
//   objOfColumnsAndOptions: Record<string, ColumnOptions>,
//   foreign: ForeignKeyReference[] = [{ table: "", column: "" }]
// ): string => {
//   const text = CREATE_TABLE_FUNC(name, objOfColumnsAndOptions, foreign, "CREATE TABLE IF NOT EXISTS");
//   console.log("CREATE TABLE TEXT: ", text);
//   return text;
// };

const CONVERT_CONSTRUCTOR_TO_CREATE_TABLE = (
  name: string,
  objOfColumnsAndOptions: Schema,
  // foreign: ForeignKeyReference[] = [{ table: "", column: "" }]
  foreign: ForeignKeyMap = null
): string => {
  return CREATE_TABLE_FUNC(name, objOfColumnsAndOptions, foreign, "CREATE TABLE");
};

export default CONVERT_CONSTRUCTOR_TO_CREATE_TABLE;

export const CONVERT_WORKER_TO_ADD = (
  tableName: string,
  workerClassInfo: Record<string, string>
): string => {
  const id = `${tableName}_id`;
  const values = Object.keys(workerClassInfo);
  let text = `INSERT INTO "${tableName}" (${id}, ${values.join(", ")}) VALUES (DEFAULT, `;
  text += values.map(v => `'${workerClassInfo[v]}'`).join(", ");
  text += ");";
  return text;
};

export const CONVERT_USER_TO_RETREIVE = (
  tableName: string,
  userInfo: Record<string, string>
): string => {
  return `SELECT * FROM "${tableName}" WHERE "password"='${userInfo.password}' AND "email"='${userInfo.email}' AND "first_name"='${userInfo.firstName}' AND "job"='${userInfo.job}'`;
};

export const CONVERT_USER_INFO_UPDATE = (
  tableName: string,
  args: { userId: string; updatedInfo: string; columnName: string },
  returning: boolean = false
): string => {
  let text = `UPDATE ${tableName} SET "${args.columnName}" = '${args.updatedInfo}' WHERE "${tableName}_id" = '${args.userId}'`;
  if (returning) text += " RETURNING *";
  return text;
};

export const CONVERT_ADD_EARNINGS = (
  tableName: string,
  args: Record<string, string>,
  idString: string = "payment_id"
): string => {
  const keys = Object.keys(args);
  let text = `INSERT INTO "${tableName}" ("${idString}", ${keys.join(", ")}) VALUES (DEFAULT, `;
  text += keys.map(k => `'${args[k]}'`).join(", ");
  text += ");";
  return text;
};

export const CONVERT_ADD_HOURLY_EARNINGS = CONVERT_ADD_EARNINGS;

export const CONVERT_GET_CALL_EARNINGS = (
  workerType: string,
  id: string | number,
  startDate: string,
  endDate: string
): string => {
  const job = workerType.toLowerCase();
  const tableName = `${job}_earnings`;
  return `SELECT "${job}_name", "date", "payment_amount", "${job}_fee", "start_time", "location", payment_id FROM ${tableName} WHERE "${job}_id" = ${id} ${filterByDate(startDate, endDate)} ORDER BY "date", "start_time" ASC`;
};

export const CONVERT_GET_HOURLY_EARNINGS = (
  workerType: string,
  id: string,
  startDate: string,
  endDate: string
): string => {
  const tableName = `hourly_earnings`;
  return `SELECT "date", "worker_name", "start_time", "end_time", "hourly_wage", "amount_earned", "clinic_name", "total_hours", clock_in_id FROM ${tableName} WHERE "worker_id" = '${id}' AND "worker_job" = '${TitleFy(workerType)}' ${filterByDate(startDate, endDate)} ORDER BY "date", "start_time"`;
};

export const CONVERT_GET_ALL_EARNINGS = (workerType: string, id: string | number): string => {
  const title = TitleFy(workerType);
  const job = workerType.toLowerCase();
  return `
    SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id"
    FROM "${job}_earnings"
    WHERE "doctor_id" = ${id}
    UNION ALL
    SELECT "date", "start_time", "worker_name", "amount_earned", "clinic_name", "worker_id", "clock_in_id"
    FROM "hourly_earnings"
    WHERE "worker_id" = ${id} AND worker_job = '${title}'
    ORDER BY "date", "start_time"`;
};

export const CONVERT_GET_SPECIFIC_PAYMENT_METHOD_TYPE = (
  workerType: string,
  id: string | number,
  paymentMethod: string,
  startDate: string,
  endDate: string
): string => {
  const job = workerType.toLowerCase();
  return `SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id", payment_amount FROM "${job}_earnings" WHERE "${job}_id" = ${id} AND "payment_method" = '${paymentMethod}' ${filterByDate(startDate, endDate)} ORDER BY "date", "start_time"`;
};

export const CONVERT_GET_DATE_RANGE_MONTHLY_EARNINGS = (
  workerType: string,
  id: string | number,
  startDate: string,
  endDate: string,
  isAll: boolean
): string => {
  const title = TitleFy(workerType);
  const job = workerType.toLowerCase();
  let text = `SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id" FROM "${job}_earnings" WHERE "${job}_id" = ${id} ${filterByDate(startDate, endDate)}`;
  if (isAll) {
    text += ` UNION ALL SELECT "date", "start_time", "worker_name", "amount_earned", "clinic_name", "worker_id", "clock_in_id" FROM "hourly_earnings" WHERE "worker_id" = ${id} AND worker_job = '${title}' ${filterByDate(startDate, endDate)}`;
  }
  return `${text} ORDER BY "date", "start_time"`;
};

export const CONVERT_UPDATE_COLUMN_WITH_CONDITION = (
  tableName: string,
  columnName: string,
  prevValue: string,
  newValue: string
): string => {
  return `UPDATE ${tableName} SET "${columnName}" = '${newValue}' WHERE "${columnName}" = '${prevValue}'`;
};





























// import { TitleFy } from "../../Helpers/Text/text";

// const filterByDate = (startDate, endDate) => {
//   const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";
//   if (isDev) {
//     return `AND date >= ('${startDate} 00:00:00'::date) AND date <= ('${endDate} 00:00:00'::date) `;
//   }
//   return `AND date >= ('${startDate} 00:00:00'::date) AND date <= ('${endDate} 00:00:00'::date) `;
// };

// const CREATE_TABLE_FUNC = (
//   name,
//   objOfColumnsAndOptions,
//   foreign = [{ table: "", column: "" }],
//   startingText
// ) => {
//   if (typeof name !== "string") {
//     throw TypeError("You must add a name for the table to be created");
//   } else if (typeof objOfColumnsAndOptions === "undefined") {
//     throw TypeError(`You must add an object with key value pairs,
//      the keys being the column names and the values being a list of uppercase postgre arguments`);
//   }
//   const obj = objOfColumnsAndOptions;
//   const objKeys = Object.keys(obj);
//   let primary;
//   let foreignKeyWord = [];
//   let text = `${startingText} "${name}" (`;
//   for (let key = 0; key < objKeys.length; key++) {
//     const currentKey = objKeys[key];
//     text += `"${currentKey}" `; // added a space
//     const keyData = obj[currentKey];
//     for (let k2 = 0; k2 < keyData.length; k2++) {
//       const current = keyData[k2];
//       const space = key === objKeys.length - 1 ? "" : " ";
//       if (current.toUpperCase() == "PRIMARY KEY") {
//         primary = currentKey.trim();
//       } else if (current.toUpperCase() == "FOREIGN KEY") {
//         foreignKeyWord.push(currentKey.trim());
//         text += " ";
//       } else {
//         text += current.trim() + " ";
//       }
//       if (k2 == keyData.length - 1) {
//         text = text.trim();
//         text += ", ";
//       }
//     }
//   }

//   let primaryKey = `PRIMARY KEY ("${primary}")`;
//   text += primaryKey;
//   if (foreignKeyWord.length > 0) {
//     foreignKeyWord.forEach((foreigner, index) => {
//       text += ", ";
//       const foreignKey = `FOREIGN KEY ("${foreigner}") `;
//       text +=
//         foreignKey +
//         `REFERENCES ${foreign[index].table}(${foreign[index].column})`;
//     });
//   }
//   text += `);`;
//   return text;
// };

// export const CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS = (
//   name,
//   objOfColumnsAndOptions,
//   foreign = [{ table: "", column: "" }]
// ) => {
//   const text = CREATE_TABLE_FUNC(
//     name,
//     objOfColumnsAndOptions,
//     foreign,
//     "CREATE TABLE IF NOT EXISTS"
//   );
//   console.log("CREATE TABLE TEXT: ", text)
//   return text;
// };

// const CONVERT_CONSTRUCTOR_TO_CREATE_TABLE = (
//   name,
//   objOfColumnsAndOptions,
//   foreign = [{ table: "", column: "" }]
// ) => {
//   const text = CREATE_TABLE_FUNC(
//     name,
//     objOfColumnsAndOptions,
//     foreign,
//     "CREATE TABLE"
//   );
//   return text;
// };

// export default CONVERT_CONSTRUCTOR_TO_CREATE_TABLE;

// export const CONVERT_WORKER_TO_ADD = (tableName, workerClassInfo) => {
//   let id = "";
//   id = tableName + "_id";
//   let values = Object.keys(workerClassInfo);
//   let text = `INSERT INTO "${tableName}" (${id}, `;
//   values.forEach((value, index) => {
//     const space = index === values.length - 1 ? " " : ", ";
//     text += value + space;
//   });
//   text += `) VALUES (DEFAULT, `;
//   values.forEach((value, index) => {
//     const actualValue = `'${workerClassInfo[value]}'`;
//     const space = index === values.length - 1 ? "" : ", ";
//     text += actualValue + space;
//   });
//   text += `);`;
//   return text;
// };

// export const CONVERT_USER_TO_RETREIVE = (tableName, userInfo) => {
//   const password = userInfo.password;
//   const email = userInfo.email;
//   const firstName = userInfo.firstName;
//   const job = userInfo.job;
//   let text = `SELECT * FROM "${tableName}" `;
//   text += `WHERE "password"='${password}' AND "email"='${email}' AND "first_name"='${firstName}' AND "job"='${job}' `;
//   return text;
// };

// export const CONVERT_USER_INFO_UPDATE = (
//   tableName,
//   args,
//   returning = false
// ) => {
//   const job_id_text = `${tableName}_id`;
//   const userId = args.userId;
//   const updatedInfo = args.updatedInfo;
//   const columnName = args.columnName;
//   let text = `UPDATE ${tableName} `;
//   text += `SET "${columnName}" = '${updatedInfo}' `;
//   text += `WHERE "${job_id_text}" = '${userId}'`;
//   if (returning) {
//     text += ` RETURNING *`;
//   }
//   return text;
// };

// export const CONVERT_ADD_EARNINGS = (
//   tableName,
//   args,
//   idString = "payment_id"
// ) => {
//   let keys = Object.keys(args);
//   let text = `INSERT INTO "${tableName}" ("${idString}", `;
//   keys.forEach((value, index) => {
//     const space = index === keys.length - 1 ? " " : ", ";
//     text += value + space;
//   });
//   text += `) VALUES (DEFAULT, `;
//   keys.forEach((key, index) => {
//     const actualKey = `'${args[key]}'`;
//     const space = index === keys.length - 1 ? "" : ", ";
//     text += actualKey + space;
//   });
//   text += `);`;
//   return text;
// };

// export const CONVERT_ADD_HOURLY_EARNINGS = (tableName, args, idString) => {
//   return CONVERT_ADD_EARNINGS(tableName, args, idString);
// };

// export const CONVERT_GET_CALL_EARNINGS = (
//   workerType,
//   id,
//   startDate,
//   endDate
// ) => {
//   const job = workerType.toLowerCase();
//   const tableName = `${job}_earnings`;
//   let text = `SELECT "${job}_name", "date", "payment_amount", "${job}_fee", "start_time", "location", payment_id `;
//   text += `FROM ${tableName} `;
//   text += `WHERE "${job}_id" = ${id} `;
//   text += filterByDate(startDate, endDate);
//   text += `ORDER BY "date", "start_time" ASC`;
//   return text;
// };

// export const CONVERT_GET_HOURLY_EARNINGS = (
//   workerType,
//   id,
//   startDate,
//   endDate
// ) => {
//   const tableName = `hourly_earnings`;
//   let text = `SELECT "date", "worker_name", "start_time", "end_time", "hourly_wage", "amount_earned", "clinic_name", "total_hours", clock_in_id `;
//   text += `FROM ${tableName} `;
//   text += `WHERE "worker_id" = '${id}' AND "worker_job" = '${TitleFy(
//     workerType
//   )}' `;
//   text += filterByDate(startDate, endDate);
//   text += `ORDER BY "date", "start_time"`;
//   return text;
// };
// // CONVERT_GET_CALL_EARNINGS;
// export const CONVERT_GET_ALL_EARNINGS = (workerType, id) => {
//   const title = TitleFy(workerType);
//   const job = workerType.toLowerCase();
//   let text = `SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id" `;
//   text += `FROM "${job}_earnings" `;
//   text += `WHERE "doctor_id" = ${id} `;
//   text += "UNION ALL ";
//   text += `SELECT "date", "start_time", "worker_name", "amount_earned", "clinic_name", "worker_id", "clock_in_id" `;
//   text += `FROM "hourly_earnings" `;
//   text += `WHERE "worker_id" = ${id} AND worker_job = '${title}' `;

//   text += `ORDER BY "date", "start_time"`;
//   return text;
// };

// export const CONVERT_GET_SPECIFIC_PAYMENT_METHOD_TYPE = (
//   workerType,
//   id,
//   paymentMethod,
//   startDate,
//   endDate
// ) => {
//   const job = workerType.toLowerCase();
//   let text = `SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id", payment_amount `;
//   text += `FROM "${job}_earnings" `;
//   text += `WHERE "${job}_id" = ${id} AND "payment_method" = '${paymentMethod}' `;
//   // text += `AND date >= ('${startDate} 00:00:00'::date) AND date <= ('${endDate} 00:00:00'::date) `;
//   text += filterByDate(startDate, endDate);
//   text += `ORDER BY "date", "start_time"`;
//   return text;
// };

// export const CONVERT_GET_DATE_RANGE_MONTHLY_EARNINGS = (
//   workerType,
//   id,
//   startDate,
//   endDate,
//   isAll
// ) => {
//   const title = TitleFy(workerType);
//   const job = workerType.toLowerCase();
//   let text = `SELECT "date", "start_time", "${job}_name", "${job}_fee", "location", "${job}_id", "payment_id" `;
//   text += `FROM "${job}_earnings" `;
//   text += `WHERE "${job}_id" = ${id} `;
//   text += filterByDate(startDate, endDate);

//   if (isAll) {
//     text += "UNION ALL ";
//     text += `SELECT "date", "start_time", "worker_name", "amount_earned", "clinic_name", "worker_id", "clock_in_id" `;
//     text += `FROM "hourly_earnings" `;
//     text += `WHERE "worker_id" = ${id} AND worker_job = '${title}' `;
//     text += filterByDate(startDate, endDate);
//   }
//   text += `ORDER BY "date", "start_time"`;
//   return text;
// };

// export const CONVERT_UPDATE_COLUMN_WITH_CONDITION = (
//   tableName,
//   columnName,
//   prevValue,
//   newValue
// ) => {
//   let text = `UPDATE ${tableName} `;
//   text += `SET "${columnName}" = '${newValue}' `;
//   text += `WHERE "${columnName}" = '${prevValue}'`;
//   return text;
// };
