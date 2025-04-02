import {
  CONVERT_USER_INFO_UPDATE,
  CONVERT_UPDATE_COLUMN_WITH_CONDITION,
} from "../../HELPERS/convertObjectToQuery";
import FETCH from "../../../API_STORAGE/APIS/FETCH";

export const UPDATE_USER_INFO = async (dataNeeded) => {
  const args = {
    userId: dataNeeded.userId,
    updatedInfo: dataNeeded.updatedInfo,
    columnName: dataNeeded.columnName,
  };

  const tableName = dataNeeded.tableName;

  const query = CONVERT_USER_INFO_UPDATE(tableName, args);
  const response = await FETCH("/api/worker_queries", "PUT", {
    query: query,
    type: tableName,
  });

  return response;
};

export const UPDATE_COLUMN_INFO_WITH_CONDITION = async (
  tableName,
  columnName,
  prevValue,
  newValue
) => {
  const query = CONVERT_UPDATE_COLUMN_WITH_CONDITION(
    tableName,
    columnName,
    prevValue,
    newValue
  );
  const response = await FETCH("/api/worker_queries", "PUT", {
    query: query,
    type: tableName,
  });

  return response;
};
