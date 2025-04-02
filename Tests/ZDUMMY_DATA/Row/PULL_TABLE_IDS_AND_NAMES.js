import FETCH from "../../../API_STORAGE/APIS/FETCH";

const FETCHER = async (query, tableName) => {
  const response = await FETCH("/api/worker_queries", "POST", {
    query: query,
    type: tableName,
    subMethod: "GET",
  });
  // console.log("IDS AND NAMES FETCHER RESPONSE: ", response);
  if (response.ok) {
    return { data: response.response, ok: response.ok };
  } else {
    return { data: response.message, ok: false };
  }
};

export const PULL_CLINIC_NAMES_AND_IDS = async () => {
  const query = `SELECT "clinic_id", "name" FROM clinic`;
  const response = await FETCHER(query, "clinic");
  return response;
};

export const PULL_WORKER_NAMES_AND_IDS = async (tableName) => {
  const table = tableName.toLowerCase();
  const idString = table + "_id";
  const query = `SELECT "${idString}", "first_name", "last_name" FROM ${table}`;
  const response = await FETCHER(query, tableName);
  return response;
};

export const PULL_EARNINGS = async (tableName) => {
  console.log("TABLE NAME: ", tableName);
  const table = tableName.toLowerCase();
  const query = `SELECT * FROM ${table}`;
  const response = await FETCHER(query, tableName);
  return response;
};

export const PULL_DOCTOR_EARNINGS = async () => {
  return PULL_EARNINGS("doctor_earnings");
};

export const PULL_DOCTOR_NAMES_AND_IDS = async () => {
  return PULL_WORKER_NAMES_AND_IDS("doctor");
};

export const PULL_NURSE_NAMES_AND_IDS = async () => {
  return PULL_WORKER_NAMES_AND_IDS("nurse");
};

export const PULL_DRIVER_NAMES_AND_IDS = async () => {
  return PULL_WORKER_NAMES_AND_IDS("driver");
};
