// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.



// Will Be Used For Joins And Such When I Get Around To It

import SQL_TABLE from "./SQL_TABLE"   //@sql/SQL_TABLE;

import { ForeignKeyMap, Messenger, None, Options, Schema } from "../../type_defs/SQL_TYPES" //"@typedefs/SQL_TYPES";


interface DatabaseSchema {
    [tableName: string]: {schema: Schema, foreignKeyMap?: ForeignKeyMap}
} 

interface TablesObject {
    [tableName: string]: SQL_TABLE
}

// type TableData extends Schema
// const existsQuery = `SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = '${tableName})`


class SQL_DB  {
    // Required Parameters
    tableSchemas: DatabaseSchema

    // Derived Parameters
    tablesObject: TablesObject

    db_call_address: string
    messenger: Messenger | false
    tableNames: string[]
    failedTables: string[]
    constructor (
        tableSchemas: DatabaseSchema,
        db_call_address: string,
        messenger: Messenger | false = false
    ){
        this.tableSchemas = tableSchemas
        this.db_call_address = db_call_address
        this.messenger = messenger
        this.tableNames = []
        this.failedTables = []

        this.construct()
    }



    construct = async () => {
        for (let tableName of Object.keys(this.tableSchemas)){
            
            const tableData = this.tableSchemas[tableName]
            const tableSchema = tableData.schema
            const foreignKeyMap = tableData.foreignKeyMap
            const currentTable = new SQL_TABLE(tableName, this.db_call_address, tableSchema, this.messenger, foreignKeyMap)
            const res = await currentTable.CREATE_TABLE()
            if (res.ok){
                this.tableNames.push(tableName)
                this.tablesObject[tableName] = currentTable
            } else {
                this.failedTables.push(tableName)
            }
        }
    }


    drop = async (tableName: string) => {
        const res = await this.tablesObject[tableName].DELETE_TABLE()
    }

    create = async (tableName: string, tableSchema: Schema, foreignKeyMap?: ForeignKeyMap) => {
        if (this.tablesObject[tableName]) {
            throw Error(`Table ${tableName} Already Exists: Please First DROP ${tableName} Or Use Another Name`)
        }
        const newTable = new SQL_TABLE(tableName, this.db_call_address, tableSchema, this.messenger, foreignKeyMap)
        const res = await newTable.CREATE_TABLE()
        if (res.ok){
            this.tablesObject[tableName] = newTable
        }
    }


    addColumnsToQuery = (columns: string[] | None) => {
        let columnsString = ""

        if (!columns || columns == null) {
            columnsString += "*"
        } else {
            if (columns.length === 1){
                columnsString += `${columns[0]} `
            } else {
                columns.forEach((column, index) => {
                    const addend = index == columns.length -1 ? " " : ", "
                    columnsString += `${column}` + addend
                })
            }
            
        }
        return columnsString
    }

    JOIN_STRING = (tableName: string, joinType: string | false = false, on: string | None = false) => {
        let joinString = ""
        if (on && typeof on === "string"){
            joinString += `"${tableName}"."${on}"`
        } else {
            joinString += `"${tableName}".${this.tablesObject[tableName].primaryKey}`
        }
        return joinString
    }

    get_sub_type_join = (main: string, joinType: string) => {
        switch (true) {
            case joinType.includes("left"):
                return `LEFT ${main} JOIN`
            case joinType.includes("right"):
                return `RIGHT ${main} JOIN`
            case joinType.includes("full"):
                return `FULL ${main} JOIN`
            case joinType.includes("self"):
                return "SELF-JOIN"
            case joinType.includes("natural"):
                return "NATURAL JOIN"
            default:
                return main+" JOIN"
        }
        

    }


    get_join_type = (joinType: string | false) => {
        if (!joinType || joinType == null){
            return "JOIN"
        } else {
            const join = joinType.toLowerCase()
            switch (true) {
                case join.includes("outer"):
                    return this.get_sub_type_join("OUTER", join.replace("outer", "").trim())
                case join.includes("inner"):
                    return this.get_sub_type_join("INNER", join.replace("inner", "").trim())
                default:
                    return this.get_sub_type_join("", join.trim())
                
            }
        }
    }


    get_on_string = (on: string | false, tableName1: string, tableName2: string) => {
        let onString = ""
        if (on == false){
            try {
                onString +=  `ON "${tableName1}"."${this.tablesObject[tableName1].primaryKey}" = "${tableName2}"."${this.tablesObject[tableName2].foreignKeyColumnNames[0]}"`
            } catch (err) {
                throw Error("Try Passing In A Valid Column Name To Match Against")
            }
            
        } else {
            onString +=  `ON "${tableName1}"."${on}" = "${tableName2}"."${on}"`
        }
    }

    SIMPLE_JOIN = async (
        tableNames: string[], 
        columnToMatch: string | None = false, 
        joinType: string | false = false,
        columns: string[] | None = false, 
        options: Options | None = false) => {
        
        const mainTable = tableNames.splice(0, 1)
        let query = "SELECT "
        query += this.addColumnsToQuery(columns)
        const joiner = this.get_join_type(joinType)
        query += joiner
        

        if (tableNames.length > 0){
            tableNames.forEach((tableName, index) => {
                query += joiner
                query += this.get_on_string(columnToMatch, mainTable[0], tableName)
            })
        } else {
            query += this.get_on_string(columnToMatch, mainTable[0], tableNames[0])
        }

        query = options ? new SQL_TABLE("filler", "filler", [{column: "filler", params: ["filler"]}], false, false).HANDLE_SUPPLEMENTARY(query, options) : query
    
        return query
    }


    MIXED_JOIN = async (
        tableNames: string[], 
        columnsToMatch: string[], 
        joinTypes: string[] | false = false, 
        columns: string[] | None = false, 
        
        options: Options | None = false) => {
        // const mainTable = tableNames.splice(0, 1)
        let query = "SELECT "
        query += this.addColumnsToQuery(columns)
        

        if (tableNames.length > 0){
            tableNames.forEach((tableName, index) => {
                try {
                    query += this.get_join_type(joinTypes[index])
                } catch (err) {
                    throw Error("Join Types, Table Names, And Matching Columns Arrays Must Have The Same Number Of Items")
                }
                
                try {
                    query += this.get_on_string(tableNames[index], columnsToMatch[index], tableName)
                } catch (err){
                    throw Error("Table Names And Matching Columns Arrays Must Have The Same Number Of Items")
                }
                
            })
        } else {
            query += this.get_join_type(joinTypes[0])
            query += this.get_on_string(tableNames[0], columnsToMatch[0], tableNames[0])
        }
        
        query = options ? new SQL_TABLE("filler", "filler", [{column: "filler", params: ["filler"]}], false, false).HANDLE_SUPPLEMENTARY(query, options) : query
    
        return query
        }
    
}