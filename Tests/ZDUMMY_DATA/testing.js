import CREATE_TABLE from "../Merkurial/SQL/QUERIES/Table/create";
import { DELETE_TABLE } from "../Merkurial/SQL/QUERIES/Table/delete";
import ADD_WORKER from "../Merkurial/SQL/QUERIES/Row/ADD_WORKER";
import {
  testClinic,
  testDoctor,
  testDriver,
  testNurse,
} from "../Merkurial/SQL/DUMMY_DATA/classes";
import { nurseTableConstructor } from "../Merkurial/SQL/OBJECT_CLASS/nurse";
import { docTableConstructor } from "../Merkurial/SQL/OBJECT_CLASS/doctor";
import { driverTableConstructor } from "../Merkurial/SQL/OBJECT_CLASS/driver";
import { clinicTableConstructor } from "../Merkurial/SQL/OBJECT_CLASS/clinic";

import { useEffect } from "react";
const Testing = () => {
  useEffect(() => {
    const foreignKeyData = {
      table: "clinic",
      column: "clinic_id",
      key: 1,
    };
    const clinicObj = clinicTableConstructor();
    const createAllTables = async () => {
      const docObj = docTableConstructor();
      const nurseObj = nurseTableConstructor();
      const driverObj = driverTableConstructor();
      const clinicObj = clinicTableConstructor();

      const clinic = await CREATE_TABLE("clinic", clinicObj);
      console.log("CLINIC: ", clinic);
      const nurse = await CREATE_TABLE("nurse", nurseObj, foreignKeyData);
      console.log("NURSE: ", nurse);
      const doctor = await CREATE_TABLE("doctor", docObj, foreignKeyData);
      console.log("DOCTOR: ", doctor);
      const driver = await CREATE_TABLE("driver", driverObj, foreignKeyData);
      console.log("DRIVER: ", driver);
    };

    const createClinic = async () => {
      const clinic = await CREATE_TABLE("clinic", testClinic());
      console.log("CLINIC: ", clinic);
    };

    const deleteAllTables = async () => {
      const doctor = await DELETE_TABLE("doctor");

      const nurse = await DELETE_TABLE("nurse");

      const driver = await DELETE_TABLE("driver");

      const clinic = await DELETE_TABLE("clinic");

      console.log("DOCTOR: ", doctor);
      console.log("NURSE: ", nurse);
      console.log("DRIVER: ", driver);
      console.log("CLINIC: ", clinic);
    };

    const createWorkerProfile = async () => {
      // const response = await ADD_CLINIC(testClinic);
      const doctor = testDoctor();
      const driver = testDriver();
      const clinic = testClinic();
      const nurse = testNurse();
      const response = await ADD_WORKER("driver", driver);
      console.log("CREATE WORKER RESPONSE: ", response);
    };

    const deleteClinic = async () => {
      const clinic = await DELETE_TABLE("clinic");
      console.log("CLINIC: ", clinic);
    };

    const addClinic = async () => {
      const newClinic = testClinic();
      console.log("NEW CLINIC: ", newClinic);
      const clinic = await ADD_WORKER("clinic", newClinic);
      console.log("CLINIC: ", clinic);
    };

    const which = 0;
    switch (which) {
      case 1:
        createWorkerProfile();
        break;
      case 2:
        createAllTables();
        break;
      case 3:
        deleteAllTables();
        break;
      case 4:
        deleteClinic();
        break;
      case 5:
        createClinic();
        break;
      case 6:
        addClinic();
        break;
      default:
        break;
    }
  }, []);
};
