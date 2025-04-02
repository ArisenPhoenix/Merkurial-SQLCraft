// Merkurial SQLCraft — Entry Point

import dotenv from "dotenv";
// import QUERY from "./packages/core/QUERY"
import SQL from "./packages/core/SQL_OBJECTS/SQL";
import { Schema } from "./packages/type_defs/SQL_TYPES";
// // import { Client } from "pg";

// // Load .env config
dotenv.config();
import getPgPool, {destroyPgPool} from "./packages/APIS/pgPool"; // adjust path

// // console.log("Loaded PSQL_URI:", process.env.PG_DB_URI);


// async function main() {
//   const testQuery = "SELECT * FROM users;";

//   // const result = await FETCH(testQuery, "GET", null, "main");
//   const result = await QUERY(testQuery);
//   // console.log("Query Result:", result);
//   console.log("Query Result:", result.response?.rows);

// }

// main().catch((err) => {
//   console.error("Main Function Error:", err);
// });
const callAddress = process.env.PG_DB_URI;
const tableName = "test_users";
const options = {"returning": "*"}

const testUsersSchema: Schema = [
  { column: "id", params: ["PRIMARY KEY", "SERIAL"] },
  { column: "name", params: ["VARCHAR(255)", "NOT NULL"] },
  { column: "email", params: ["VARCHAR(255)", "UNIQUE", "NOT NULL"] },
  { column: "created_at", params: ["TIMESTAMP", "DEFAULT NOW()"] },
];

const runTestCreateTable = async () => {
  const testTable = new SQL(tableName, callAddress, testUsersSchema, console.log);
  const result = await testTable.CREATE_TABLE();
  const dataRes = await testTable.initializeTable();

  // console.log("Table Created Result:", result);
  return testTable;
};

const runTestAdd = async () => {
  const testTable = await runTestCreateTable(); 
  const result = await testTable.addRow({"name": "Allen", "email": "Allen@yahoo.com"}, options)
  // console.log("Added Row Result:", result)
  return result
}

const runTestDelete = async () => {
  const testTable = await runTestCreateTable(); 
  const result = await testTable.deleteRowByAnyColumns({"email": "Allen@yahoo.com"}, options)
  // console.log("Deleted Row Result: ", result);
  return result
}


const runTestAddDelete = async () => {
  // const testTable = new SQL(tableName, callAddress, testUsersSchema, console.log);
  const testTable = await runTestCreateTable();
  // console.log("Table Data: ", dataRes);

  // await testTable.deleteRow({"name": "Allen"}, {"returning": "*"}) // in case the entry exists from another attempt
  await runTestDelete()

  const result = await runTestAdd()
  const result2 = await runTestDelete()
  return [result, result2]
}


const runTestUpdate = async () => {
  const testTable = await runTestCreateTable();
  console.log("OUTPUT ROWS: ", testTable.outputRows)

  await runTestDelete();
  await runTestAdd();
  const updateResult = await testTable.updateRowByAnyColumns({"name": "Allen", "email": "Allen@yahoo.com"}, options);
  console.log("UPDATE RESULT: ", updateResult);
  console.log("OUTPUT ROWS: ", testTable.outputRows)
  return updateResult
}

runTestUpdate().catch(console.error).finally(() => getPgPool().end());
getPgPool().end();

