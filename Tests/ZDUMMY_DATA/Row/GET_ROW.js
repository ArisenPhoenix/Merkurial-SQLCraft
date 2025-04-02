import { CONVERT_USER_TO_RETREIVE } from "../../HELPERS/convertObjectToQuery";
import FETCH from "../../../API_STORAGE/APIS/FETCH";

export const GET_USER = async (args) => {
  const tableName = args.tableName;
  const userInfo = args.userInfo;
  const query = CONVERT_USER_TO_RETREIVE(tableName, userInfo);
  const response = await FETCH("/api/worker_queries", "POST", {
    query: query,
    type: tableName,
    subMethod: "GET",
  });

  if (response.ok) {
    return response;
  } else {
    return { ok: false, error: "Couldn't Find User" };
  }
};
