import * as React from "react";
import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableContainer,
  TableBody,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "./../styles.module.css";
import CircleIcon from "@mui/icons-material/Circle";
import { formatCurrency } from "@/utils/utils";

interface iTrasactionData {
  amount: string;
  table: any;
  grandTotal: any;
  serviceFee: any;
  transactionItems: any;
  status: string;
  total: string;
  charges: string;
  discount: string;
}

export default function DoneOrders() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [transactionData, setTransactionData] = useState<iTrasactionData[]>([]);
  const [serviceFee, setServiceFee] = useState(false);

  const fetchTransactionsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transactionarchive/today?branch_Id=${branch_Id}`,
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions data");
      }
      const data = await response.json();
      if (data) {
        const statusPreparing = data
          .filter(
            (transactionStatus: iTrasactionData) =>
              transactionStatus.status === "complete"
          )
          .map((tempData: iTrasactionData) => {
            tempData.grandTotal = parseFloat(tempData.amount);
            if (parseFloat(tempData.charges) > 0) {
              tempData.grandTotal += parseFloat(tempData.charges);
            }
            if (parseFloat(tempData.discount) > 0) {
              tempData.grandTotal -= parseFloat(tempData.discount);
            }
            console.log(tempData.serviceFee);
            setServiceFee(tempData.serviceFee);
            return tempData;
          });

        setTransactionData(statusPreparing);
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., redirect to login page)
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);
  return (
    mounted && (
      <div>
        <Grid container justifyContent="center" height="100vh">
          <Paper elevation={3} style={{ padding: "20px", width: 550 }}>
            {transactionData.length > 0 ? (
              transactionData.map((item, index) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {item.status === "complete" && (
                      <CircleIcon
                        style={{ color: "#12BF38", fontSize: "25" }}
                      />
                    )}
                    <Typography className={styles.text}>
                      &nbsp;{`Table ${item.table} `}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={styles.accordion_FD}>
                      <div style={{ flexDirection: "column", display: "flex" }}>
                        <h5 style={{ marginBottom: 10 }}>Charges</h5>
                        <h5 style={{ marginBottom: 10 }}>Discount</h5>
                        <h5 style={{ marginBottom: 10 }}>Service Fee</h5>
                        <h5 style={{ marginBottom: 10 }}>Status</h5>
                        <h5 style={{ marginBottom: 10 }}>Subtotal</h5>
                        <h5 style={{ marginBottom: 10 }}>Total</h5>
                      </div>
                      <div style={{ flexDirection: "column", display: "flex" }}>
                        <h5 style={{ marginBottom: 10 }}>
                          {formatCurrency(parseFloat(item.charges || "0"))}
                        </h5>
                        <h5 style={{ marginBottom: 10 }}>
                          {formatCurrency(parseFloat(item.discount || "0"))}
                        </h5>
                        <h5 style={{ marginBottom: 10 }}>
                          {formatCurrency(parseFloat(item.serviceFee || "0"))}
                        </h5>
                        {item.status === "complete" && (
                          <h5 style={{ marginBottom: 10 }}>Completed</h5>
                        )}
                        <h5 style={{ marginBottom: 10 }}>
                          {formatCurrency(parseFloat(item.amount))}
                        </h5>
                        <h5
                          style={{
                            marginBottom: 10,
                            textDecorationLine: "underline",
                          }}
                        >
                          {formatCurrency(
                            parseFloat(item.grandTotal || item.amount) +
                              parseFloat(item.serviceFee || 0)
                          )}
                        </h5>
                      </div>
                    </div>
                    <TableContainer>
                      <Table
                        sx={{ minWidth: 400 }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className={styles.text}>Qty</TableCell>
                            <TableCell align="left" className={styles.text}>
                              Title
                            </TableCell>
                            <TableCell align="right" className={styles.text}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.transactionItems.map(
                            (transItem: any, transIndex: any) => (
                              <TableRow>
                                <TableCell width={8}>
                                  {transItem.quantity}
                                </TableCell>
                                <TableCell align="left">
                                  <div>
                                    <div> {transItem.menuItem.title || ""}</div>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  {transItem.status === "draft" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.statusDraft}`}
                                    >
                                      Draft
                                    </button>
                                  )}
                                  {transItem.status === "new" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.statusNew}`}
                                    >
                                      New
                                    </button>
                                  )}
                                  {transItem.status === "cooking" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.statusCooking}`}
                                    >
                                      Cooking
                                    </button>
                                  )}
                                  {transItem.status === "ready" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.statusReady}`}
                                    >
                                      Ready
                                    </button>
                                  )}

                                  {transItem.status === "served" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.doneColor}`}
                                    >
                                      Served
                                    </button>
                                  )}
                                  {transItem.status === "cancelled" && (
                                    <button
                                      className={`${styles._buttonDone} ${styles.cancelColor}`}
                                    >
                                      Cancelled
                                    </button>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                      <Table />
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </Paper>
        </Grid>
      </div>
    )
  );
}
