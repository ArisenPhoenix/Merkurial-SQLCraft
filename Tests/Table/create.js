// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.


import FETCH from "@apis/FETCH";
import { CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS } from "@helpers/convertObjectToQuery";
import CONVERT_CONSTRUCTOR_TO_CREATE_TABLE from "@helpers/convertObjectToQuery";
import GET_CLASS, {
  GET_CLASS_OPTIONS,
} from "../../OBJECT_CLASS/ALL_WORKER_CLASSES";

const CREATE_TABLE = async (name, queryObj, foreign) => {
  const queryText = CONVERT_CONSTRUCTOR_TO_CREATE_TABLE(
    name,
    queryObj,
    foreign
  );

  const response = await FETCH(
    "/api/postgre",
    "POST",
    queryText,
    "CREATE TABLE"
  );
  return response;
};

export default CREATE_TABLE;

export const CREATE_TABLE_IF_NOT_EXISTS = async (name, queryObj, foreign) => {
  const queryText = CONVERT_CONSTRUCTOR_TO_CREATE_TABLE_IF_NOT_EXISTS(
    name,
    queryObj,
    foreign
  );

  const response = await FETCH(
    "/api/postgre",
    "POST",
    queryText,
    "CREATE TABLE IF NOT EXISTS"
  );
  return response; 
};

export const CREATE_ALL_TABLES = async () => {
  const options = GET_CLASS_OPTIONS();
  options.forEach(async (option, index) => {
    const tableName = option.toLowerCase();
    const constructor = GET_CLASS(tableName).constuctor;
    const data = constructor();
    // console.log("CONSTRUCTOR DATA: ", data);
    const response = await CREATE_TABLE(
      tableName,
      data,
      tableName === "clinic"
        ? null
        : {
            table: "clinic",
            column: "clinic_id",
          }
    );
    console.log(`RESPONSE FOR ${option}: `, response);
  });
};
