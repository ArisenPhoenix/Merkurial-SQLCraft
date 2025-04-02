// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.





export type Key = string|number
export type Value = string | null | number | boolean | Number | RowEntry[] | RowEntry | object //includes JSONB

export type ColumnName = string
export type RowName = string

export type DefaultValue = string | number | boolean | null | string[] | number[] | boolean[] | null[] | any[]


/** Primary Key - a very simple object with {key: "", value: } structure
 * @param {ColumnName} key - the name of the column containing the Primary Key
 */

export type PrimaryKey = ColumnName
// export interface PrimaryKey {
//   key: ColumnName;
//   value: Key
// }

/** ForeignKey - data used for the foreign key within an SQL table
 * @param table - string - the name of the table being referred to
 * @param columnName - string - the name of the column being referenced for the table that contains the foreign key in other words, the actual FK
 */
export interface ForeignKey {
  table: string;
  columnName: ColumnName;
}



// /** ForeignKeyValue - Used For Passing In A Select Statement For Matching Against Foreign Keys And Values
//  * 
//  * It will Look Like This: {desiredForeignKey: {ColunnName: Value}}
//  * @param tablename - The Value of That You Want To Meet The Condition
//  * @param value - The Value That Must Be Matched Against
 
//  */
export type ForeignKeyName = string | number

 
/** ForeignKeyValuePair - Includes The Table The Foreign Key Is Pointing And The Value To Match
 * @param foreignKey : string - Name Of The Table With The Primary Key
 * @param value : Value - The Value Held Within That Table That Needs To Be Matched With
 */
export type ForeignKeyValuePair = {
  [foreignKey: ForeignKeyName]: string | Number
}


// export interface ForeignKeys = {}

/** ForeignKeyValueMatcher */

export interface ForeignKeyValueMatcher {
  [desiredForeignKey: ForeignKeyName]: ForeignKeyValuePair
}

/** None - Value of null, false, or undefined */
export type None = null | false | undefined

/** Column Data is a Single Entry For A Schema and has predefined Key Value Pairs
 * @param {ColumnName} column is column and is always a string
 * @param {Params} params is a string array of SQL column arguments needed for creating the table i.e FOREIGN KEY or VARCHAR
 */

export interface ForeignKeyData {
  [currentTableColumnName: string]: ForeignKey
}

export type ForeignKeyMap = ForeignKeyData | None

/** Column Data is a Single Entry For A Schema and has predefined Key Value Pairs
 * @param {ColumnName} column is column and is always a string
 * @param {Params} params is a string array of SQL column arguments needed for creating the table i.e FOREIGN KEY or VARCHAR
 */
export interface ColumnData {
  column: ColumnName;
  params: Params;
}

/** Schema is an array of objects containing Column Data - key being column values being a Param Array
 * @param {ColumnName}
 * @param {Params}
 */
export type Schema = ColumnData[]


/**
 * ColumnEntry is a key value pair, the key being the column name and the value the value within that column
 * @param {ColumnName} column - column name used within the table
 * @param {Value} value - Value within the the column and row
 */
export interface ColumnEntry {
  [columnName: string]: ColumnName
}




/**
 * RowEntry is a key value pair, the key being the column name and the value within that column
 * @param {ColumnName} column - column name used within the table
 * @param {Value} value - Value within the the column and row
 */
export type RowEntry = {
  [columnName: string]: Value | Value[]
}



/** ColumnInput - an object of containing column Names as keys and values within as values
 * @param {ColumnName} key - the key just must be a string
 * @param {Value} value - the value within that cell
 */
export type ColumnInput = {[key: ColumnName]: Value}



/** A List Of Foreign Keys As Some Tables Take Multiple Foreign Keys In Case I Decide To Use Arrays For Compiling The Information Later*/
export type ForeignKeys = ForeignKey[] | null

/** Messager - a simple interface being used to allow a call back function for purposes of messages within an app
 * @param {string} message - a parameter needed to send data back to the callback
 * @returns {void|string}
 */
export interface Messenger {
  (message: string | boolean): void
} 

export type Sex = "M" | "F" | "X"


/** Cell is a structured column entry which allows for arrays, it is a dictionary with pre-defined keys
 * @param {ColumnName} column - key is column
 * @param {Value} value - key is value
 */
export interface Cell {
  [column: ColumnName]: [value: Value]
}


// export type Row_ = {
//   [columnName: ColumnName]: Value

// }


/**
 * @param columnName: string = Value | Value[] | any
 */
export interface Row {
  [columnName: string]: Value | Value[] | any
  // [columnNmae: string]: Value[]
}

export type Rows = Row[]





export interface TableResponse {
  ok: boolean,
  rows: Rows,
  err: string|null|boolean
  message: string|null,
  isPopulated: boolean|null|undefined
}


export interface InitialResponse {
  RowCtor: any,
  command: any, 
  rowCount: number|null, 
  oid: null | number | string, 
  rows: Rows, 
  fields: Object[], 
  _parsers: null[]|string[]|number[]
} 


export type Param = string
export type Params = Param[]


/**
 * @param: groupBy false |
 * @param: orderBy false | string
 * @param: limit false | number | Number
 * @param: offset false | number | Number
 * @param: returning false | string | string[]
 */
export interface Options {
  groupBy?: string | false, 
  orderBy?: string | false, 
  limit?: number | Number | false, 
  offset?: false | number | Number, 
  returning?: false | string | string[]
}

export const defaultOptions: Options = {
  groupBy: false,
  orderBy: false,
  limit: false,
  offset: false,
  returning: false,
}








