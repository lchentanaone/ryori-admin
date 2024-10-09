import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Grid, Paper } from "@mui/material";
import styles from "./../styles.module.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import IconButton from "@mui/material/IconButton";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import _ from "lodash";
import {
  capitalizeFirstLetter,
  formatDateMonth,
  formatTime,
  getTimeDifference,
} from "@/utils/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface iTrasactionData {
  table: any;
  grandTotal: any;
  transactionItems: any;
  status: string;
  _id: string;
  title?: string;
  price?: string;
  description?: string;
  photo?: any;
  quantity?: string;
  cookingTime?: string;
  total: string;
  charges: string;
  discount: string;
  menuCategories?: string[];
  createdAt: string;
}
interface Notification {
  message: string;
}

export default function Orders() {
  const SERVICE_FEE_TO_CUSTOMER = 8;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [prevTransactionData, setPrevTransactionData] = useState<
    iTrasactionData[]
  >([]);
  const [transactionData, setTransactionData] = useState<iTrasactionData[]>([]);
  const [serviceFee, setServiceFee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inConfirm, setInConfirm] = useState(false);
  const socket = io(process.env.NEXT_PUBLIC_API_URL || "");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [unmute, setUnmute] = useState(false);

  const sendToSocket = async (socket: any, data: any) => {
    const branch_Id = await localStorage.getItem("branch_Id");
    socket.emit("join-channel-branch", { branch_Id });
    listenToSocket(socket);
    socket.emit("message-to-branch", {
      title: "Customer Just Ordered",
      message: `The kitchen has been updated the order of table #${data.table}`,
      branch_Id,
    });
  };
  const listenToSocket = async (socket: any) => {
    socket.on("join-channel-branch-response", (data: any) => {
      if (data) {
        console.log("You are connected to the branch socket.", {
          data,
          socket,
        });
      }
    });
    socket.on("message-to-branch-response", (data: any) => {
      if (data) {
        setIsLoading(false);
        setTimeout(() => {
          setInConfirm(true);
        }, 100);
      }
    });
    // socket.on("message-to-customer", (data: any) => {
    //   if (data) {
    //     smartRedirect();
    //   }
    // });
  };

  const fetchBranchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const branch_Id = localStorage.getItem("branch_Id");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}`,
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
      setServiceFee(data.serviceChargesToCustomer);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactionsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transaction?branch_Id=${branch_Id}`,
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
              transactionStatus.status !== "complete" &&
              transactionStatus.status !== "cancelled"
          )
          .map((tempData: iTrasactionData) => {
            let grandTotal = parseFloat(tempData.total);

            if (parseFloat(tempData.charges) > 0) {
              grandTotal += parseFloat(tempData.charges);
            }
            if (parseFloat(tempData.discount) > 0) {
              grandTotal -= parseFloat(tempData.discount);
            }
            return { ...tempData, grandTotal };
          });
        const prevStatusPreparing = _.cloneDeep(statusPreparing);
        setTransactionData(statusPreparing);
        setPrevTransactionData(prevStatusPreparing);
      }
    } catch (error) {
      console.error(error);
      // Handle error (e.g., redirect to login page)
    }
  };

  const playBeep = async () => {
    if (!unmute) {
      const beepSound = new Audio();
      beepSound.src = "/beep/ryori-beep_1.mp3";
      beepSound.load();
      await beepSound.play();
    } else {
      const beepSound = new Audio();
      beepSound.src = "/beep/ryori-beep_1.mp3";
      beepSound.load();
      await beepSound.pause();
    }
  };
  const watchPushNotifications = async () => {
    const branch_Id = await localStorage.getItem("branch_Id");
    const channelName = `channel-branch-${branch_Id}`;

    socket.emit("join-channel-branch", { branch_Id });
    socket.on("join-channel-branch-response", () => {
      console.log("Connected to branch " + branch_Id);
    });
    socket.on("message-to-branch", (data) => {
      if (data) {
        const options = {
          message: data.message,
        };
        playBeep();
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          options,
        ]);
        fetchTransactionsData();
      }
    });
  };

  const updateTransStatus = async (
    _id: string,
    newStatus: string,
    transactionKey: any
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Specify content type
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transaction/${_id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction status");
      }
      const responseData = await response.json();

      try {
        // This will send a blank message to the customer to update their current page.
        socket.emit("message-to-customer", {
          customer_socket: responseData.customer_socket,
        });
        sendToSocket(socket, {
          ...response,
          table: transactionData[transactionKey].table,
        });
      } catch (err) {
        console.error(err);
      }
      fetchTransactionsData();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const updateTransactionItem = async (
    _id: string,
    newStatus: string,
    transactionKey: any
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Specify content type
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transactionItem/${_id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction item");
      }

      // Extract the customer_socket from the response data
      const responseData = await response.json();

      const _transaction = [...transactionData];
      const itemIndex = _transaction[transactionKey].transactionItems.findIndex(
        (item: { _id: string }) => item._id === _id
      );
      if (itemIndex !== -1) {
        _transaction[transactionKey].transactionItems[itemIndex].status =
          newStatus;
      }
      // This will send a blank message to the customer to update their current page.
      socket.emit("message-to-customer", {
        customer_socket: responseData.customer_socket,
      });
      sendToSocket(socket, {
        ...response,
        table: _transaction[transactionKey].table,
      });
      setTransactionData(_transaction);
    } catch (error) {
      console.error("Error updating transaction data:", error);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
    watchPushNotifications();
    fetchBranchData();
  }, []);

  const toggleDrop = (id: any) => {
    setOpen(open === id ? null : id);
  };

  return (
    mounted && (
      <div>
        <Stack
          sx={{
            position: "fixed",
            top: 2,
            right: 2,
            zIndex: 9999,
          }}
          spacing={0.5}
        >
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              variant="filled"
              severity="error"
              icon={<NotificationsActiveIcon fontSize="inherit" />}
              onClose={() => {
                setNotifications((prevNotifications) =>
                  prevNotifications.filter((_, i) => i !== index)
                );
              }}
            >
              {notification.message}
            </Alert>
          ))}
        </Stack>
        <Grid container justifyContent="center">
          <Paper elevation={3} style={{ padding: "20px", width: "100%" }}>
            <div>
              <div style={{ marginBottom: 10 }}>
                <h2 style={{ color: "#D80000" }}>
                  Orders: {transactionData.length || 0}
                </h2>
              </div>
              <div>
                <table>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "2px solid #F2F2F2",
                      }}
                    >
                      <th className={`${styles.th1} ${styles.leftAlign}`}>
                        Table ID
                      </th>
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Status
                      </th>

                      <th
                        className={`${styles.th1} ${styles.rightAlign} ${styles.width200}`}
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData.length > 0 ? (
                      transactionData.map((item, index) => (
                        <>
                          <tr
                            style={{
                              borderBottom: "2px solid #F2F2F2",
                              // padding: 100,
                              height: 60,
                            }}
                          >
                            <td className={`${styles.th} ${styles.leftAlign}`}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {open === item._id ? (
                                  <KeyboardArrowUpIcon
                                    onClick={() => toggleDrop(item._id)}
                                    className={
                                      open === item._id
                                        ? styles.selectedRow
                                        : ""
                                    }
                                    style={{ color: "#008012", fontSize: "25" }}
                                  />
                                ) : (
                                  <KeyboardArrowDownIcon
                                    onClick={() => toggleDrop(item._id)}
                                    className={
                                      open === item._id
                                        ? styles.selectedRow
                                        : ""
                                    }
                                    style={{ color: "#008012", fontSize: "25" }}
                                  />
                                )}
                                &nbsp;&nbsp;
                                {item.table}
                              </div>
                            </td>
                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              <span className={styles.statusText}>
                                {capitalizeFirstLetter(item.status || "")}
                              </span>
                            </td>

                            <td
                              className={`${styles.thData} ${styles.rightAlign} ${styles.width200}`}
                            >
                              <div className={styles.date}>
                                {formatDateMonth(item.createdAt)}
                              </div>

                              <div className={styles.time}>
                                {formatTime(item.createdAt)} &nbsp;(
                                {getTimeDifference(item.createdAt)})
                              </div>
                            </td>
                          </tr>
                          <tr
                            className={`${styles.innerDetails} ${
                              open === item._id ? styles.expanded : ""
                            }`}
                          >
                            <td colSpan={6}>
                              <div>
                                {open === item._id && (
                                  <>
                                    <table>
                                      <tbody>
                                        <tr
                                          style={{
                                            padding: "10px",
                                            borderRadius: "50px",
                                            height: 50,
                                            borderBottom: "1px solid #C6C6C6",
                                          }}
                                        >
                                          <td
                                            className={`${styles.th} ${styles.qty}`}
                                          >
                                            Qty
                                          </td>
                                          <td
                                            className={`${styles.th} ${styles.item}`}
                                          >
                                            Item
                                          </td>
                                          <td
                                            className={`${styles.th} ${styles.status}`}
                                          >
                                            Status
                                          </td>

                                          <td
                                            className={`${styles.th} ${styles.customerName}`}
                                          >
                                            Customer
                                          </td>
                                          <td
                                            className={`${styles.th} ${styles.notes}`}
                                          >
                                            Notes
                                          </td>
                                          <td
                                            className={`${styles.th} ${styles.actionBtn}`}
                                          >
                                            Action
                                          </td>
                                        </tr>
                                        {item.transactionItems.map(
                                          (transItem: any, transIndex: any) => (
                                            <tr
                                              style={{
                                                height: 50,
                                                borderBottom:
                                                  "1px solid #C6C6C6",
                                              }}
                                            >
                                              <td
                                                className={`${styles.thData} ${styles.qty}`}
                                              >
                                                <span
                                                  className={styles.item_qty}
                                                >
                                                  {transItem.quantity}x
                                                </span>
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.item}`}
                                              >
                                                <span className={styles.title}>
                                                  {transItem.menuItem.title ||
                                                    ""}
                                                </span>
                                                <span
                                                  className={styles.lineSpacing}
                                                >
                                                  {transItem.addons &&
                                                    transItem.addons.length >
                                                      0 && (
                                                      <ol
                                                        className={
                                                          styles.addOnsList
                                                        }
                                                        style={{
                                                          listStyleType: "none",
                                                          paddingLeft: 20,
                                                        }}
                                                      >
                                                        {transItem.addons.map(
                                                          (
                                                            i: string,
                                                            key: number
                                                          ) => (
                                                            <li
                                                              key={key}
                                                              className={
                                                                styles.addOns
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles.addOnsCheck
                                                                }
                                                              >
                                                                ✔
                                                              </span>{" "}
                                                              {i}
                                                            </li>
                                                          )
                                                        )}
                                                      </ol>
                                                    )}
                                                </span>
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.status}`}
                                              >
                                                <span
                                                  className={styles.statusText}
                                                >
                                                  {capitalizeFirstLetter(
                                                    transItem.status || ""
                                                  )}
                                                </span>
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.customerName}`}
                                              >
                                                <span>
                                                  {transItem.customer_name ||
                                                    ""}
                                                </span>
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.notes}`}
                                              >
                                                {transItem.notes || ""}
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.actionBtn}`}
                                              >
                                                {transItem.status === "new" && (
                                                  <button
                                                    className={`${styles._buttonItem} ${styles.statusNew}`}
                                                    onClick={() =>
                                                      updateTransactionItem(
                                                        transItem._id,
                                                        "cooking",
                                                        index
                                                      )
                                                    }
                                                  >
                                                    Cooking
                                                  </button>
                                                )}
                                                {transItem.status ===
                                                  "cooking" && (
                                                  <button
                                                    className={`${styles._buttonItem} ${styles.statusCooking}`}
                                                    onClick={() =>
                                                      updateTransactionItem(
                                                        transItem._id,
                                                        "ready",
                                                        index
                                                      )
                                                    }
                                                  >
                                                    Ready
                                                  </button>
                                                )}

                                                {transItem.status ===
                                                  "cancelled" && (
                                                  <button
                                                    className={`${styles._buttonItem} ${styles.cancelColor}`}
                                                  >
                                                    Canceled
                                                  </button>
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <div>Loading...</div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Paper>
        </Grid>
      </div>
    )
  );
}
