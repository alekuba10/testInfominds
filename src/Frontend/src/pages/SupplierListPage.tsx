import { Typography } from "@mui/material";
import TableSupplier from "../components/TableSupplier";
import { useEffect, useState } from "react";

import axios from "axios";
import { SupplierListQuery } from "../interface";
import LoadingElement from "../components/LoadingElement";

const url = "/api/suppliers/list";

export default function SupplierListPage() {
  const [list, setList] = useState<SupplierListQuery[]>([]);

  const getData = async () => {
    const response = await axios.get(url);
    setList(response.data as SupplierListQuery[]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Suppliers
      </Typography>
      {list.length > 0 ? <TableSupplier data={list} /> : <LoadingElement />}
    </>
  );
}
