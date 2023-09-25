import { Button, TextField, Typography } from "@mui/material";

import TableEmployee from "../components/TableEmployee";

import axios from "axios";

import { ChangeEvent, useEffect, useState } from "react";

import { EmployeeListQuery } from "../interface";
import LoadingElement from "../components/LoadingElement";

const url = "/api/employees/list";

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLastName(e.target.value);
  };

  const getData = async (firstName?: string, lastName?: string) => {
    const params: { firstName?: string; lastName?: string } = {};
    if (firstName) {
      params.firstName = firstName;
    }

    if (lastName) {
      params.lastName = lastName;
    }

    const response = await axios.get(url, { params: params });
    setList(response.data as EmployeeListQuery[]);
    setLoading(false);
  };

  useEffect(() => {
    getData(firstName, lastName);
  }, [firstName, lastName]);

  const downloadXMLFile = () => {
    const xmlFile = toXml(list);

    const file = new Blob([xmlFile], { type: "text/plain" });

    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "employees.xml";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Employees
      </Typography>

      {loading ? (
        <LoadingElement />
      ) : (
        <div>
          <Button variant="contained" onClick={downloadXMLFile}>
            Export XML
          </Button>
          <TextField
            id="search-bar"
            className="text"
            onChange={handleChangeFirstName}
            placeholder="Search by firstname..."
            fullWidth
          />
          <TextField
            id="search-bar"
            className="text"
            onChange={handleChangeLastName}
            placeholder="Search by lastname..."
            fullWidth
          />

          <TableEmployee data={list} />
        </div>
      )}
    </>
  );
}

const toXml = (data: EmployeeListQuery[]) => {
  const header = "<?xml version='1.0' encoding='utf-8'?>";
  const beginXML = "<Employees>";
  const endXML = "</Employees>";

  const xmlReduce = data.reduce((result, el) => {
    return (
      result +
      `<employee><id>"${el.id}"</id><code>"${el.code}"</code><firstName>${el.firstName}</firstName><lastName>${el.lastName}</lastName><phone>${el.phone}</phone><email>${el.email}</email><address>${el.address}</address></employee>\n`
    );
  }, "");
  return header.concat(beginXML).concat(xmlReduce).concat(endXML);
};
