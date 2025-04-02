import {
  CONVERT_GET_CALL_EARNINGS,
  CONVERT_GET_HOURLY_EARNINGS,
  CONVERT_GET_ALL_EARNINGS,
  CONVERT_GET_SPECIFIC_PAYMENT_METHOD_TYPE,
  CONVERT_GET_DATE_RANGE_MONTHLY_EARNINGS,
} from "../../HELPERS/convertObjectToQuery";

import FETCH from "../../../API_STORAGE/APIS/FETCH";

export const GET_CALL_EARNINGS = async (workerType, id, startDate, endDate) => {
  const query = CONVERT_GET_CALL_EARNINGS(workerType, id, startDate, endDate);
  const tableName = `${workerType.toLowerCase()}_earnings`;
  const response = await FETCH("/api/dashboard_queries", "POST", {
    query: query,
    type: tableName,
    subMethod: "GET",
  });
  return response;
};

export const GET_HOURLY_EARNINGS = async (
  workerType,
  id,
  startDate,
  endDate
) => {
  const query = CONVERT_GET_HOURLY_EARNINGS(workerType, id, startDate, endDate);
  const tableName = `hourly_earnings`;
  const response = await FETCH("/api/dashboard_queries", "POST", {
    query: query,
    type: tableName,
    subMethod: "GET",
  });
  return response;
};

export const GET_ALL_EARNINGS = async (workerType, id, startDate, endDate) => {
  const query = CONVERT_GET_ALL_EARNINGS(workerType, id, startDate, endDate);
  const response = await FETCH("/api/dashboard_queries", "POST", {
    query: query,
    type: "doctor_earnings",
    subMethod: "GET",
  });
  return response;
};

export const GET_SPECIFIC_PAYMENT_METHOD_TYPE = async (
  workerType,
  id,
  paymentMethod,
  startDate,
  endDate
) => {
  const query = CONVERT_GET_SPECIFIC_PAYMENT_METHOD_TYPE(
    workerType,
    id,
    paymentMethod,
    startDate,
    endDate
  );
  const response = await FETCH("/api/dashboard_queries", "POST", {
    query: query,
    type: "doctor_earnings",
    subMethod: "GET",
  });
  return response;
};

export const GET_DATE_RANGE_MONTHLY_EARNINGS = async (
  workerType,
  id,
  startDate,
  endDate,
  isAll
) => {
  const query = CONVERT_GET_DATE_RANGE_MONTHLY_EARNINGS(
    workerType,
    id,
    startDate,
    endDate,
    isAll
  );
  const response = await FETCH("/api/dashboard_queries", "POST", {
    query: query,
    type: "doctor_earnings",
    subMethod: "GET",
  });
  return response;
};
