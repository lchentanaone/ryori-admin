import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { formatDate } from "@/utils/utils";

interface Daily {
  _id: string;
  amount: number;
  charges: number;
  discount: number;
  createdAt: string;
}

export default function DailyTransaction() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactionData, setTransactionData] = useState<Daily[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchEmpoyee = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transaction/today?branch_Id=${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const trasnData = await response.json();
      setTransactionData(trasnData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmpoyee();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div style={{ marginTop: 10, paddingLeft: 50, paddingRight: 50 }}>
      <h2>Daily Transactions</h2>
      <Paper sx={{ width: "100%", overflow: "hidden", marginBottom: 2 }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className="trans_header">No.</TableCell>
                <TableCell className="trans_header">Amount</TableCell>
                <TableCell className="trans_header">Charge</TableCell>
                <TableCell className="trans_header">Discount</TableCell>
                <TableCell className="trans_header">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(transactionData) &&
                transactionData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell className="trans_cell">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          className="trans_cell"
                        >
                          {item.amount -
                            (item.discount || 0) +
                            (item.charges || 0)}
                        </TableCell>
                        <TableCell className="trans_cell">
                          {item.charges || 0}
                        </TableCell>
                        <TableCell className="trans_cell">
                          {item.discount || 0}
                        </TableCell>
                        <TableCell className="trans_cell">
                          {formatDate(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={transactionData.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
