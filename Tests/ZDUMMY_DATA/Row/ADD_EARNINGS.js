import FETCH from "../../../API_STORAGE/APIS/FETCH";
import { CONVERT_ADD_EARNINGS, CONVERT_ADD_HOURLY_EARNINGS } from "../../HELPERS/convertObjectToQuery";
const ADD_EARNINGS = async (tableName, workerClassData) => {
  const query = CONVERT_ADD_EARNINGS(tableName, workerClassData);
  const response = await FETCH("/api/worker_queries", "POST", {
    query: query,
    type: tableName,
  });
  return response;
};

export default ADD_EARNINGS;

export const ADD_HOURLY_EARNINGS = async (tableName, workerClassData) => {
  const query = CONVERT_ADD_HOURLY_EARNINGS(
    tableName,
    workerClassData,
    "clock_in_id"
  );
  const response = await FETCH("/api/worker_queries", "POST", {
    query: query,
    type: tableName,
  });
  return response;
};
