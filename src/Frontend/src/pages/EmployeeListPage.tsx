import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";

import axios from "axios";

import { ChangeEvent, useEffect, useState } from "react";

const url = "/api/employees/list";

interface EmployeeListQuery {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
}

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFirstName(e.target.value);
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLastName(e.target.value);
  };

  //const filterData = filterTable();

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

      {list.length > 0 ? (
        <TableContainer component={Paper}>
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
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Code</StyledTableHeadCell>
                <StyledTableHeadCell>Firstname</StyledTableHeadCell>
                <StyledTableHeadCell>Lastname</StyledTableHeadCell>
                <StyledTableHeadCell>Email</StyledTableHeadCell>
                <StyledTableHeadCell>Phone</StyledTableHeadCell>
                <StyledTableHeadCell>Address</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        loadingElement()
      )}
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));

const loadingElement = () => {
  return <h1>Loading Table...</h1>;
};

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
