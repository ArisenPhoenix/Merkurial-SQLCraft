// Merkurial SQLCraft
// Copyright (c) 2025 Brandon M. Marcure
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// FETCH.ts
// import { Pool } from "pg";
import getPgPool from "./pgPool"; // adjust path

import dotenv from "dotenv";
import { HttpMethod } from "../type_defs/api";
dotenv.config();



export interface FetchResponse {
  ok: boolean;
  rows?: any[];
  err?: any;
  message?: string;
}
// export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
// export interface FetchResponse {
//   ok: boolean;
//   rows?: any[];
//   err?: any;
//   message?: string;
// }

// const pgPool = new Pool({
//   connectionString: process.env.PG_DB_URI
// });

const FETCH = async <T = any>(
  api_route: string,
  method: HttpMethod,
  body?: object | null,
  functionThatCalled?: string
): Promise<T | FetchResponse> => {
  const m = method.toUpperCase();
  const b = body ?? null;

  try {
    // If this is a full HTTP(S) URL, use fetch()
    if (api_route.startsWith("http://") || api_route.startsWith("https://")) {
      const response = await fetch(api_route, {
        method: m,
        headers: {"Content-Type": "application/json"},
        body: m === "GET" ? null : JSON.stringify(b),
      });

      try {
        const data = await response.json();
        // console.log("FETCH TRY data: ", data)
        return data;
      } catch {
        return response as unknown as T;
      }

    } else if (api_route.startsWith("postgresql://")) {
      // Handle raw SQL execution using pg
      if (!b || typeof b !== "object" || !("query" in b)) {
        throw new Error("PostgreSQL fetch requires a { query } object in body.");
      }

      const { query } = b as { query: string };
      const pgPool = getPgPool();
      const result = await pgPool.query(query);
      // pgPool.end();
      // console.log("FETCH Result: ", result)
      return {
        ok: true,
        rows: result.rows,
        message: `Query successful in ${functionThatCalled}`,
      };
    } else {
      throw new Error(`Invalid api_route: ${api_route}`);
    }
  } catch (err: any) {
    console.error(
      functionThatCalled
        ? `ERROR IN FETCH CATCH | Called By: ${functionThatCalled}`
        : "ERROR: ",
      err
    );

    return {
      err,
      ok: false,
      message: "FETCHING Error",
    };
  }
};

export default FETCH;


// const FETCH = async (api_route, method, body, functionThatCalled) => {
//     const m = method.toUpperCase();
//     const b = body ? body : null;
//     try {
//       const response = await fetch(api_route, {
//         method: m.toUpperCase(),
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: m === "GET" ? null : JSON.stringify(b),
//       });
//       try {
//         return response.json()
//       } catch {
//         return response
//       }
      
//     } catch (err) {
//       console.log(
//         functionThatCalled
//           ? `ERROR IN FETCH CATCH | Called By: ${functionThatCalled}`
//           : "ERROR: ",
//         err
//       );
//       return { err: err, ok: false, message: "FETCHING Error" };
//     }
//   };
  
//   export default FETCH;


// utils/fetch.ts
// import { HttpMethod, FetchResponse } from "../type_defs/api";



// const FETCH = async <T = any>(
//   api_route: string,
//   method: HttpMethod,
//   body?: object | null,
//   functionThatCalled?: string
// ): Promise<T | FetchResponse> => {
//   const m = method.toUpperCase();
//   const b = body ?? null;

//   try {
//     const response = await fetch(api_route, {
//       method: m,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: m === "GET" ? null : JSON.stringify(b),
//     });

//     try {
//       const data = await response.json();
//       return data;
//     } catch {
//       return response as unknown as T;
//     }

//   } catch (err: any) {
//     console.error(
//       functionThatCalled
//         ? `ERROR IN FETCH CATCH | Called By: ${functionThatCalled}`
//         : "ERROR: ",
//       err
//     );

//     return {
//       err,
//       ok: false,
//       message: "FETCHING Error",
//     };
//   }
// };

// export default FETCH;


// // FETCH.ts
// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.PG_DB_URI
// });

// export const FETCH = async (
//   payload: { query: string },
//   method: string,
//   url: string,
//   calledBy: string
// ) => {
//   try {
//     // Allow switching implementations later
//     if (url.startsWith("http")) {
//       // Placeholder: use fetch if you want remote HTTP-based DB
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       return await res.json();
//     }

//     // Default to direct SQL query
//     const result = await pool.query(payload.query);
//     return {
//       ok: true,
//       rows: result.rows,
//       message: `Query success in ${calledBy}`
//     };

//   } catch (err) {
//     console.error("ERROR IN FETCH CATCH | Called By:", calledBy, err);
//     return {
//       ok: false,
//       err: err.message,
//       rows: [],
//       message: `Query failed in ${calledBy}`
//     };
//   }
// };

// export default FETCH;


   