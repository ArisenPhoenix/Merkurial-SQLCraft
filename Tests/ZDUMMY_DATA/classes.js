import { Doctor } from "../OBJECT_CLASS/doctor";
import { Driver } from "../OBJECT_CLASS/driver";
import { Nurse } from "../OBJECT_CLASS/nurse";
import { Clinic } from "../OBJECT_CLASS/clinic";

export const testDriver = () => {
  const driver = new Driver(
    "Mak",
    "Wichiwat",
    "Driver",
    30,
    "F",
    "alina.marcure@gmail.com",
    "Brandonandice1!",
    "Racing",
    "(815) 910-5479",
    "makD",
    "234.23482834234 x 22.2094092942",
    "32/02",
    3,
    "Phuket",
    "Kathu",
    "Kamala",
    600,
    240,
    40,
    2,
    4,
    "01/01/2022",
    Math.round(Math.random() * 1000).toString(),
    Math.round(Math.random() * 1000),
    2
    // Math.round(Math.random() * 1000).toString()
  );
  return driver;
};

export const testNurse = () => {
  const nurse = new Nurse(
    "Wichita",
    "Sarikathura",
    "Nurse",
    36,
    "F",
    "wichita.marcure@gmail.com",
    "wichitaIsBest!",
    "Injections",
    "(815) 785-9584",
    "w.Sarikathura",
    "234.23482834234 x 22.2094092942",
    "32/02",
    3,
    "Phuket",
    "Kathu",
    "Kamala",
    600,
    240,
    40,
    2,
    4,
    "01/01/2022",
    Math.random().toString(),
    Math.random().toString()
  );
  return nurse;
};

export const testDoctor = () => {
  const doctor = new Doctor(
    "Alina",
    "Marcure",
    "Doctor",
    30,
    "F",
    "alina.marcure@gmail.com",
    "Brandonandice1!",
    "General Practitioner",
    "(815)656-5180",
    "line",
    "234.23482834234 x 22.2094092942",
    "32/02",
    3,
    "Phuket",
    "Kathu",
    "Kamala",
    600,
    240,
    40,
    2,
    4,
    "01/01/2022",
    Math.random().toString()
  );
  return doctor;
};

export const testClinic = () => {
  const names = [
    "Sai",
    "Nam",
    "Yen",
    "sai",
    "nam",
    "yen",
    "SAI",
    "NAM",
    "YEN",
    "SAI NAM YEN",
    "sai nam yen",
    "Sai Nam Yen",
  ];
  const num = Math.round(Math.random() * names.length - 1);
  // console.log("NUM: ", num);
  const name = names[num];
  // console.log("CLINIC NAME: ", name);
  const clinic = new Clinic(
    name,
    "Phuket",
    "Kathu",
    "Kamala",
    "(815) 555-4544",
    " alskdfjlak west 31st rd",
    "2.232434223 x 25.2002093300",
    "20/0233",
    3,
    300000,
    1000000000
  );

  return clinic;
};
