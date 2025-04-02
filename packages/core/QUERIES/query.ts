// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.


// import { Client, QueryResult } from "pg";

// // Define the return shape
// interface QueryResponse<T = any> {
//   ok: boolean;
//   response?: QueryResult<T>;
//   err?: any;
// }

// export const HANDLE_QUERY = async (
//   query: string
// ): Promise<{ err: QueryResponse } | QueryResponse> => {
//   try {
//     const response = await QUERY(query);
//     if (!response.ok) {
//       return { err: { ...response } };
//     }
//     return response;
//   } catch (err) {
//     return { err: err, ok: false };
//   }
// };

// const QUERY = async (query: string): Promise<QueryResponse> => {
//   const client = new Client({
//     connectionString: process.env.PG_DB_URI,
//   });

//   try {
//     await client.connect(); // Connect to DB
//     const response = await client.query(query); // Execute query
//     return { ok: true, response };
//   } catch (err: any) {
//     console.log("ERROR IN QUERY FUNCTION ==================================");
//     console.error(err.stack);
//     if (err.detail) console.error(err.detail);
//     console.log("QUERY: ", query);
//     return { ok: false, err };
//   } finally {
//     await client.end(); // Always close
//   }
// };

// export default QUERY;


















// // Merkurial SQLCraft
// // Copyright (c) 2025 Brandon M. Marcure
// // This Source Code Form is subject to the terms of the Mozilla Public
// // License, v. 2.0. If a copy of the MPL was not distributed with this
// // file, You can obtain one at http://mozilla.org/MPL/2.0/.





// import { Client } from "pg";

// export const HANDLE_QUERY = async (query) => {
//   try {
//     const response = await QUERY(query);
//     if (!response.ok) {
//       return { err: { ...response } };
//     }
//     return response;
//   } catch (err) {
//     return { err: err, ok: false };
//   }
// };

// const QUERY = async (query) => {
//   const client = new Client(process.env.PSQL_URI);
//   try {
//     await client.connect(); // gets connection
//     const response = await client.query(query); // sends queries
//     return { ok: true, response: response };
//   } catch (err) {
//     console.log("ERROR IN QUERY FUNCTION ==================================");
//     console.error(err.stack);
//     err.detail && console.error(err.detail);
//     console.log("QUERY: ", query)
//     return { ok: false, err: err };
//   } finally {
//     await client.end();
//   }
// };




// export default QUERY;
