// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.



import { ColumnData, Params, DefaultValue } from "../../type_defs/SQL_TYPES";
// import { ColumnData, Params, DefaultValue } from '@types/SQL_TYPES'; // ✅


export default class SQL_COLUMN {
    tableName: string
    columnName: string
    columnParams: Params
    columnData: ColumnData
    constructor(
        tableName: string,
        columnName: string,
        columnParams: Params
    ) {
        this.tableName = tableName
        this.columnName = columnName
        this.columnParams = columnParams
        this.columnData = {column: columnName, params: columnParams}
    }

    addColumn (defaultValue: DefaultValue ){

    }

    removeColumn (){
        const name = this.columnName
        const removeQuery = ""

    } 
     
    updateColumn (
        oldValue: any,
        newValue: any,
        conditional_column = this.columnName,
        tableName: string = this.tableName,
        returning = false
        ) {
        let query = `UPDATE ${tableName} `;
        query += `SET "${this.columnName}" = '${newValue}' `;
        query += `WHERE "${conditional_column}" = '${oldValue}'`;
        if (returning) {
            query += ` RETURNING *`;
        }
        return query;
    }

    updateColumn2 (
        oldValue: any,
        newValue: any,
        conditional_column = this.columnName,
        tableName: string = this.tableName,
    ){
        let text = `UPDATE ${tableName} `;
        text += `SET "${this.columnName}" = '${newValue}' `;
        text += `WHERE "${conditional_column}" = '${oldValue}'`;
        return text;
    }
}