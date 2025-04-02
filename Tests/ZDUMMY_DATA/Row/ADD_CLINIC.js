import FETCH from "../../../Requests/FETCH";
import { CONVERT_WORKER_TO_ADD } from "../../HELPERS/convertObjectToQuery";

const ADD_CLINIC = async (clinicClass) => {
  const query = CONVERT_WORKER_TO_ADD("clinic", clinicClass);
  const response = FETCH(
    "/api/worker",
    "POST",
    { query: query, type: "clinic" },
    "ADD WORKER"
  );
  return response;
};

export default ADD_CLINIC;
