// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.




import FETCH from "../../../API_STORAGE/APIS/FETCH";
import { GET_CLASS_OPTIONS } from "../../OBJECT_CLASS/ALL_WORKER_CLASSES";

const DELETE_TABLE = async (tableName) => {
  console.log("DELETE TABLE TABLE NAME: ", tableName);
  let text = `DROP TABLE ${tableName}`;
  const response = await FETCH(
    "/api/table_queries",
    "DELETE",
    text,
    "DELETE TABLE"
  );
  return response;
};

export const DELETE_ALL_TABLES = async () => {
  const options = GET_CLASS_OPTIONS();
  options.forEach(async (option, index) => {
    console.log("OPTION: ", option);
    const tableName = option.toLowerCase();
    const response = await DELETE_TABLE(tableName);
    console.log(`RESPONSE FOR ${option}: `, response);
  });
};

export default DELETE_TABLE;

export const deleteColumn = (obj) => {
  const id = obj.id;
  const tableName = obj.tableName;
};

export const deleteRow = (obj) => {
  const row = obj.row;
  const tableName = obj.tableName;
};

export const deleteAllRows = async (tableName) => {
  const text = `DELETE FROM ${tableName}`;
  const response = await FETCH("/api/postgre", "DELETE", text);
  console.log("DELTE ALL ROWS RESPONSE: ", response);
  return response;
};
