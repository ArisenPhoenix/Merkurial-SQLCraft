// // Merkurial SQLCraft
// // Copyright (c) 2025 Brandon M. Marcure
// // This Source Code Form is subject to the terms of the Mozilla Public
// // License, v. 2.0. If a copy of the MPL was not distributed with this
// // file, You can obtain one at http://mozilla.org/MPL/2.0/.


import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

interface QueryResponse {
  ok: boolean;
  message: string | null;
  response?: any;
  err?: string | null;
  status: number;
  data?: any;
}

export const HANDLE_QUERY_ERROR = async (error: any): Promise<QueryResponse> => {
  try {
    const json = JSON.parse(error);
    const errMsg = json.error ?? json.message ?? json.err;

    if (errMsg) {
      return {
        ok: false,
        err: errMsg,
        data: error,
        message: "Unknown Error",
        status: 500,
      };
    }

    return {
      ok: true,
      message: "I Don't Know What Happened LOLS",
      data: "I Guess No Error Here",
      status: 200,
    };
  } catch {
    const msg: string = error?.message ?? String(error);

    switch (true) {
      case msg.includes("already exists"):
        return { ok: true, message: "Already Exists", err: msg, status: 208 };

      case msg.includes("does not exist"):
        return { ok: false, message: "Does Not Exist", err: msg, status: 400 };

      case msg.includes("duplicate"):
        return {
          ok: true,
          message: "Unique Parameter For Table Was Defiled and Duplicated :)",
          err: msg,
          status: 208,
        };

      case msg.includes("column") && msg.includes("type"):
        return {
          ok: false,
          message: "Column Type Error",
          err: msg,
          status: 400,
        };

      case msg === `'syntax error at or near "{"'`:
        return {
          ok: false,
          message: "This Error Is Most Likely Due To An SQL jsonb or SQL Array Syntax Error",
          err: msg,
          status: 400,
        };

      default:
        return { ok: false, message: "Unknown Error", err: msg, status: 500 };
    }
  }
};

const QUERY = async (query: string): Promise<QueryResponse> => {
  const client = new Client({ connectionString: process.env.PG_DB_URI });

  try {
    await client.connect();
    const response = await client.query(query);

    return {
      ok: true,
      message: null,
      response,
      err: null,
      status: 200,
    };
  } catch (err: any) {
    try {
      const parsed = JSON.parse(err);
      console.error("ERROR: ", parsed);
    } catch {
      // raw error fallback
    }

    const returnData = await HANDLE_QUERY_ERROR(err);
    return returnData;
  } finally {
    await client.end();
  }
};

export default QUERY;



















// import { Client } from "pg";

// export const HANDLE_QUERY_ERROR = async (error) => {
  
//   try {
//     let json = JSON.parse(error);
//     if (json.error || json.message) {
//       return {
//         ok: false,
//         err: json.error
//           ? json.error
//           : json.message
//           ? json.message
//           : json.err,
//         data: error,
//         message: "Unknown Error",
//         status: 500,
//       };
//     } else {
//       return {
//         ok: true,
//         message: "I Don't Know What Happened LOLS",
//         data: "I Guess No Error Here",
//         status: 200
//       }
//     }
//   } catch (jsonParseError) {
//     // means error is already an object
//     const msg = error.message;
//     switch (true) {
//       case msg.includes("already exists"):
//         return { ok: true, message: "Already Exists", err: msg, status: 208 };

//       case msg.includes("does not exist"):
//         return { ok: false, message: "Does Not Exist", err: msg, status: 400 };

//       case msg.includes("duplicate"):
//         return {
//           ok: true,
//           message: "Unique Parameter For Table Was Defiled and Duplicated :)",
//           err: msg,
//           status: 208,
//         };

//       case msg.includes("column") && msg.includes("type"):
//         return {
//           ok: false,
//           message: "Column Type Error",
//           err: msg,
//           status: 400
//         }

//       case msg == `'syntax error at or near "{"'`:
//         return {
//           ok: false,
//           message: "This Error Is Most Likely Due To An SQL jsonb or SQL Array Syntax Error",
//           err: msg,
//           status: 400
//         }

//       default:
//         return { ok: false, message: "Unknown Error", err: msg, status: 500 };
//     }
//   }
// };

// const QUERY = async (query) => {
//   const client = new Client(process.env.PG_DB_URI);
//   try {
//     await client.connect();
//     const response = await client.query(query); // sends queries

//     client.end();
//     return {
//       ok: true,
//       message: null,
//       response: response,
//       err: null,
//       status: 200,
//     };
//   } catch (err) {
//     try {
//       const text = JSON.parse(err)
//       console.log("ERROR: ", text)
      
//     } catch (err) {
      
//     }
    
//     const returnData = HANDLE_QUERY_ERROR(err);
//     client.end();
//     return returnData;
//   }
// };

// export default QUERY;
