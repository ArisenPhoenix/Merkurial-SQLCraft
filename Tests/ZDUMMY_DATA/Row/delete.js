import FETCH from "../../../API_STORAGE/APIS/FETCH";

export const DELETE_ONE_ROW_MULTI_CONDITIONS = async (
  tableName,
  conditionsObj
) => {
  let query = `DELETE FROM ${tableName} `;

  conditionsObj.forEach((condition, index) => {
    const col = condition.columnName;
    const operator = condition.operator;
    const comparator = condition.comparator;
    const betweenConditions = condition.betweenConditions
      ? condition.betweenConditions
      : "AND";

    if (index === 0) {
      query += "WHERE ";
    }
    // console.log("TYPE OF DATE: ", typeof condition.date);

    let next = conditionsObj.length > 1 ? `${betweenConditions} ` : "";
    next = index === conditionsObj.length - 1 ? "" : next;
    query += `"${col}" ${operator} `;
    const cell =
      typeof comparator === "number" ? comparator : `'${comparator}'`;
    query += cell + " ";

    query += next;
  });

  console.log("QUERY: ", query);
  const response = await FETCH("/api/worker_queries", "DELETE", {
    query: query,
    type: tableName,
  });
  return response;
};

export const DELETE_ONE_ROW = async (tableName, columnName, equalTo) => {
  let query = `DELETE FROM ${tableName} `;
  query += `WHERE "${columnName}" = '${equalTo}'`;
  const response = await FETCH("/api/worker_queries", "DELETE", {
    query: query,
    type: tableName,
  });
  return response;
};

export const DELETE_MANY_ROWS = async (
  tableName,
  columnName,
  operator,
  equalTo
) => {
  let query = `DELETE FROM ${tableName} `;
  query += `WHERE "${columnName}" ${operator} '${equalTo}'`;
  const response = await FETCH("/api/worker_queries", "DELETE", {
    query: query,
    type: tableName,
  });
  return response;
};

export const DELETE_ONE_EARNING_FROM_THE_ALL_TABLE = async (
  tableName,
  args,
  jobName
) => {
  const job = jobName.toLowerCase();
  const worker_id = args[`${job}_id`];

  let query = `DELETE FROM ${tableName} `;
  if (tableName === `${job}_earnings`) {
    query += `WHERE "payment_id" = ${args.payment_id} AND "${job}_id" = ${worker_id}`;
  } else {
    query += `WHERE clock_in_id = ${args.payment_id} AND "worker_id" = ${worker_id}`;
  }

  const response = await FETCH("/api/dashboard_queries", "DELETE", {
    query: query,
    type: tableName,
  });
  return response;
};
