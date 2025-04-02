// import { useEffect, useState } from "react";
// import SQL_TABLE from "../SQL/OBJECT_CLASS/SQL";
// import {
//   Schema,
//   Messenger, 
//   ColumnInput,
//   ForeignKeyValuePair,
//   TABLE_RESPONSE,
//   RowEntry,
//   defaultOptions,
//   Options
// } from "../SQL/OBJECT_CLASS/SQL_TYPES";
// import useToggle from "./Toggle";
// import { EQUAL } from "Merkurial/Helpers/Objects/compare";

// type Table = SQL_TABLE | null;
 
// export type SetIsActive = (x: boolean) => void;
// export type Setter = (x: any[]) => void | any[];
// export type Setter2 = (x: any[]) => any

// export type UseSqlTable = {
//   isQuerying: boolean;
  
//   ADD_ROW: (x: RowEntry, options: Options | undefined) => Promise<any>;

//   FIND_ROWS: (x: ColumnInput, z: Options) => Promise<TABLE_RESPONSE>;

//   DELETE_TABLE: () => Promise<void>;

//   SELECT_ALL_BY_FOREIGN_KEY: (
//     id: ForeignKeyValuePair
//   ) => Promise<TABLE_RESPONSE>;

//   TABLE: SQL_TABLE;  

//   TABLE_DATA: Array<{}>;

//   isActive: boolean; 

//   setIsActive: SetIsActive;

//   SET_SQL_TABLE_DATA: Setter;
//   DELETE_ROW: (x: RowEntry, options: Options | undefined) => Promise<any>;
//   DELETE_ROW_BY_ANY_COLUMNS: (x: RowEntry, options: Options | undefined) => Promise<any>;
//   UPDATE_ROW: (x: RowEntry, options: Options | undefined) => Promise<any>;
//   UPDATE_ROW_BY_ANY_COLUMNS: (x: RowEntry, options: Options | undefined) => Promise<any>;
//   UPDATE_FULL_TABLE_WITH_LAST_TABLE_QUERY: (x: string | undefined) => Promise<any>
// }; 

// const handleResponse = (res, SET_SQL_TABLE_DATA): boolean | any[] => {
//   if (res.ok){
//     if (res.rows?.length > 0) { 
//       const rows = res.rows
//       SET_SQL_TABLE_DATA(rows);
       
//       return rows
//     }
//   }
  
//   return false
// }

// const handleResponse2 = (SET_SQL_TABLE_DATA) => {
//   SET_SQL_TABLE_DATA((prev) => {
//     const rows2 = prev.slice()
//     return rows2
//   })
// }
 
// const useSqlTable = (
//   tablename: string, 
//   tableSchema: Schema,
//   api_address = "/api/postgres",

//   initializer = "GET",
//   activated = false,
//   messenger: Messenger | null | false = null,
//   options: Options = defaultOptions

// ): UseSqlTable => { 
//   const [isQuerying, toggleIsQuerying] = useToggle(false);
//   const [isActive, setIsActive] = useState(activated);
//   const [SQL_TABLE_CLASS, SET_SQL_TABLE_CLASS] = useState<Table>(
//     new SQL_TABLE(tablename, api_address, tableSchema, messenger)
//   );

//   const [SQL_TABLE_DATA, SET_SQL_TABLE_DATA] = useState(SQL_TABLE_CLASS.allRows); 
//   const tableInitializer = initializer.toUpperCase(); 

//   const ADD_ROW = async (rowEntryObject: RowEntry, options: Options | undefined, returnRows: boolean = false) => {
//     if (rowEntryObject) { 
//       if (SQL_TABLE_CLASS){ 
//         toggleIsQuerying();
//         const newRowRes = await SQL_TABLE_CLASS.addRow(rowEntryObject, {...options, returning: "*"})
//         toggleIsQuerying();
//         if (returnRows){
//           return newRowRes
//         }
//         return newRowRes.length > 0 ? true : false
//       } else {
//         console.log("Table Hasn't Yet Initialized")
//         return false
//       }
//     }
//   }


//   const DELETE_ROW = async (rowEntryObject: RowEntry, options: Options | undefined) => {
//     if (rowEntryObject){
//       if (SQL_TABLE_CLASS){ 
//         toggleIsQuerying();
//         const rowDeleteRes = await SQL_TABLE_CLASS.deleteRow(rowEntryObject, {...options, returning: "*"})
//         console.log("DELETE ROW RESPONSE: ", rowDeleteRes)
//         toggleIsQuerying();
//         return Object.keys(rowDeleteRes).length > 0 ? true : false
//       } else {
//         console.log("Table Hasn't Yet Initialized")
//       }
//     }
//   }


//   const DELETE_ROW_BY_ANY_COLUMNS = async (rowEntryObject: RowEntry, options: Options | undefined) => {
//     if (rowEntryObject){
//       if (SQL_TABLE_CLASS){
//         toggleIsQuerying()
//         const rowDelResponse = await SQL_TABLE_CLASS.deleteRowByAnyColumns(rowEntryObject, {...options, returning: "*"})
//         toggleIsQuerying()
//         return Object.keys(rowDelResponse).length > 0 ? true : false
//       }
//     }
//   }

//   const UPDATE_ROW_BY_ANY_COLUMNS = async (rowEntryObject: RowEntry, options: Options | undefined) => {
//     if (rowEntryObject){
//       if (SQL_TABLE_CLASS){
//         toggleIsQuerying()
//         const rowUpdateRes = await SQL_TABLE_CLASS.updateRowByAnyColumns(rowEntryObject, {...options, returning: "*"})
//         toggleIsQuerying()
//         return rowUpdateRes ? true : false
//       } else {
//         console.log("Table Hasn't Yet Initialized")
//       }
//     } else {
//       console.log("A ROW OBJECT ENTRY MUST BE SUPPLIED")
//     }
    
//   }

//   const UPDATE_FULL_TABLE_WITH_LAST_TABLE_QUERY = async (query?: string | undefined) => {
//     if (SQL_TABLE_CLASS){
//       toggleIsQuerying()
//       const tableUpdateRes = await SQL_TABLE_CLASS.UPDATE_TABLE(query)
//       toggleIsQuerying()
//       return tableUpdateRes
//     } else {
//       console.log("Table Hasn't Yet Initialized")
//     }
//   }


//   const UPDATE_ROW = async (rowEntryObject: RowEntry, options: Options | undefined) => {
//     if (rowEntryObject){
//       // console.log("ROW ENTRY OBJECT FOR UPDATE: ", rowEntryObject)
//       if (SQL_TABLE_CLASS){
//         toggleIsQuerying();
//         const rowUpdateRes = await SQL_TABLE_CLASS.updateRow(rowEntryObject, {...options, returning: "*"})
//         // console.log("ROW UPDATE RESPONSE: ", rowUpdateRes)
//         toggleIsQuerying();
//         return rowUpdateRes ? true : false
//       } else {
//         console.log("Table Hasn't Yet Initialized")
//       }
//     } else {
//       console.log("A ROW OBJECT ENTRY MUST BE SUPPLIED")
//     }
//   }

//   const SELECT_ALL_BY_FOREIGN_KEY = async (id: ForeignKeyValuePair) => {
//     if (id) {
//       if (SQL_TABLE_CLASS) {
//         toggleIsQuerying()
//         const res = await SQL_TABLE_CLASS.SELECT_ALL_BY_FOREIGN_KEY_MATCH(id, options);
//         if (handleResponse(res, SET_SQL_TABLE_DATA)){
//           handleResponse2(SET_SQL_TABLE_DATA)
//         }
         
//         toggleIsQuerying()
//         return res;
//       }
//     }
//   };

//   const FIND_ROWS = async (columnsToSearchBy: ColumnInput) => {
//     if (columnsToSearchBy) {
//       if (SQL_TABLE_CLASS) {
//         toggleIsQuerying()
//         const res = await SQL_TABLE_CLASS.SelectAllByValues(columnsToSearchBy, options );
//         toggleIsQuerying() 
//         return res;
//       }
//     }
//   };

//   const DELETE_TABLE = async () => {
//     if (SQL_TABLE_CLASS) {
//       const response = await SQL_TABLE_CLASS.DELETE_TABLE();
//       if (response.ok) {
//         if (!SQL_TABLE_CLASS.hasTable){
//           setIsActive(false)
//         }
//       }

//     }
//   }; 

//   const CREATE_TABLE = async () => {
//     toggleIsQuerying()
//     const response = await SQL_TABLE_CLASS.CREATE_TABLE() 
//     // console.log("useSqlTable CREATE Response: ", response)
//     if (response.ok && response.rows && response.rows.length > 0){
//       handleResponse(response, SET_SQL_TABLE_DATA) 
//       setIsActive(true)
//     }
//     toggleIsQuerying()

//   }


//   useEffect(() => {
//     if (!EQUAL(SQL_TABLE_DATA, SQL_TABLE_CLASS.allRows)){
//       console.log(`Updating Table ${SQL_TABLE_CLASS.tableName} Rows........................................`)
//       const newRows = [...SQL_TABLE_CLASS.allRows]
//       SET_SQL_TABLE_DATA([...newRows])
//     }
    
//   }, [SQL_TABLE_CLASS.allRows, SQL_TABLE_DATA])


//   return {
//     isQuerying: isQuerying,
//     ADD_ROW: ADD_ROW,
//     FIND_ROWS: FIND_ROWS,
//     DELETE_TABLE: DELETE_TABLE,
//     SELECT_ALL_BY_FOREIGN_KEY: SELECT_ALL_BY_FOREIGN_KEY,
//     TABLE: SQL_TABLE_CLASS,
//     TABLE_DATA: SQL_TABLE_DATA,
//     isActive: isActive,
//     setIsActive: setIsActive, 
//     SET_SQL_TABLE_DATA: SET_SQL_TABLE_DATA,
//     DELETE_ROW: DELETE_ROW,
//     UPDATE_ROW: UPDATE_ROW,
//     DELETE_ROW_BY_ANY_COLUMNS: DELETE_ROW_BY_ANY_COLUMNS,
//     UPDATE_ROW_BY_ANY_COLUMNS: UPDATE_ROW_BY_ANY_COLUMNS,
//     UPDATE_FULL_TABLE_WITH_LAST_TABLE_QUERY: UPDATE_FULL_TABLE_WITH_LAST_TABLE_QUERY
//   };
// };

// export default useSqlTable;