import FETCH from "../../../API_STORAGE/APIS/FETCH";
import { CONVERT_WORKER_TO_ADD } from "../../HELPERS/convertObjectToQuery";
const ADD_WORKER = async (tableName, workerClass) => {
  const query = CONVERT_WORKER_TO_ADD(tableName, workerClass);
  const response = await FETCH("/api/worker_queries", "POST", {
    query: query,
    type: tableName,
  });
  return response;
};

export default ADD_WORKER;
