import React, { useState, useEffect, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";
import {
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import styles from "./../styles.module.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import dialogStyle from "./diaglogStyle.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import _ from "lodash";
import {
  capitalizeFirstLetter,
  formatCurrency,
  formatDateMonth,
  formatTime,
  getTimeDifference,
} from "@/utils/utils";
import Swal from "sweetalert2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface iTrasactionData {
  table: any;
  subTotal: any;
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
interface AddOns {
  title: string;
  price: number;
}
interface SelectedItemType {
  menuItem: any;
  _id: string;
  addons: AddOns[];
  totalPrice: number;
}
interface Notification {
  message: string;
}

export default function Orders() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [prevTransactionData, setPrevTransactionData] = useState<
    iTrasactionData[]
  >([]);
  const [transactionData, setTransactionData] = useState<iTrasactionData[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>();
  const [quantity, setQuantity] = useState(0);
  const [serviceFee, setServiceFee] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openBeep, setOpenBeep] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inConfirm, setInConfirm] = useState(false);
  const socket = io(process.env.NEXT_PUBLIC_API_URL || "");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [processType, setProcessType] = useState("");

  let fee: number | null = null;
  let threshold: number | null = null;

  if (typeof window !== "undefined") {
    const feeStr = localStorage.getItem("service_fee");
    const thresholdStr = localStorage.getItem("threshold");

    if (feeStr !== null && thresholdStr !== null) {
      fee = parseFloat(feeStr);
      threshold = parseFloat(thresholdStr);
    }
  } else {
    // Handle the case where localStorage is not available
  }

  const sendToSocket = async (socket: any, data: any) => {
    const branch_Id = await localStorage.getItem("branch_Id");
    socket.emit("join-channel-branch", { branch_Id });
    listenToSocket(socket);
    socket.emit("message-to-branch", {
      title: "Customer Just Ordered",
      message: `The dining has been updated the order of table#${data.table}`,
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
            return { ...tempData, grandTotal, subTotal: tempData.total };
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
    const beepSound = new Audio();
    beepSound.src = "/beep/ryori-beep_1.mp3";
    beepSound.load();
    await beepSound.play();
  };

  const watchPushNotifications = async () => {
    const branch_Id = await localStorage.getItem("branch_Id");
    const channelName = `channel-branch-${branch_Id}`;

    socket.emit("join-channel-branch", { branch_Id });
    socket.on("join-channel-branch-response", () => {
      console.log("Connected to branch ");
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

  const handleComplete = async (item: any, index: any) => {
    const swalResponse = await Swal.fire({
      title: "Complete Transaction",
      text: "Are you sure you want to complete this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No",
      reverseButtons: true,
    });

    if (swalResponse.isConfirmed) {
      updateTransStatus(item._id, "complete", index);
    }
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
      // const options = {
      //   message: "The dining has been updated the order!",
      // };
      playBeep();
      // setNotifications((prevNotifications) => [...prevNotifications, options]);
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
      playBeep();
    } catch (error) {
      console.error("Error updating transaction data:", error);
    }
  };

  const saveChargeDiscount = async (_id: any, index: any | number) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transaction/${_id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            table: transactionData[index].table,
            charges: transactionData[index].charges,
            discount: transactionData[index].discount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to charge/discount transaction");
      }
      const options = {
        message: "Saved Successfully!",
      };
      playBeep();
      setNotifications((prevNotifications) => [...prevNotifications, options]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleChangeText = (
    key: string | number,
    value: any,
    index: number
  ) => {
    const tempData = [...transactionData];
    const dataIndex = index as number;
    const dataKey = key as keyof iTrasactionData;

    tempData[dataIndex][dataKey] = value;

    tempData[dataIndex].grandTotal = tempData[dataIndex].subTotal =
      tempData[dataIndex].total;

    if (parseFloat(tempData[dataIndex].charges) > 0) {
      tempData[dataIndex].grandTotal += parseFloat(tempData[dataIndex].charges);
    }
    if (parseFloat(tempData[dataIndex].discount) > 0) {
      tempData[dataIndex].grandTotal -= parseFloat(
        tempData[dataIndex].discount
      );
    }
    setTransactionData(tempData);
  };

  const transItemQty = async (
    newStatus: any,
    selectedItem: { _id: any },
    quantity: any
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transactionItem/${selectedItem._id}`,
        {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify({
            quantity: quantity,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction item quantity");
      }
      fetchTransactionsData();

      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating transaction item quantity:", error);
    }
  };

  const handleClose = (value: string) => {
    setOpenDialog(false);
  };

  const handleClickOpen = async (transItem: any) => {
    setQuantity(transItem.quantity);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pos/transactionItem/${transItem._id}`,
        {
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSelectedItem(data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleIncrease = () => {
    const newQuantity = parseInt(quantity.toString()) + 1;
    setQuantity(newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(1, parseInt(quantity.toString(), 10) - 1);
    setQuantity(newQuantity);
  };

  const toggleDrop = (id: any) => {
    setOpen(open === id ? null : id);
  };

  const handleOnBeep = () => {
    playBeep();
    setOpenBeep(false);
  };

  useEffect(() => {
    fetchTransactionsData();
    watchPushNotifications();
    fetchBranchData();
    setOpenBeep(true);

    const typeProcess = localStorage.getItem("processType");
    setProcessType(typeProcess ?? "");
  }, []);

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
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Action
                      </th>
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Sub-Total
                      </th>
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Charges
                      </th>
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Discount
                      </th>
                      {serviceFee ? (
                        <th className={`${styles.th1} ${styles.middleAlign}`}>
                          Service Fee
                        </th>
                      ) : null}
                      <th className={`${styles.th1} ${styles.middleAlign}`}>
                        Total
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
                                <input
                                  type="number"
                                  className="customTextGlobal"
                                  value={
                                    item.table ? item.table.toString() : ""
                                  }
                                  onChange={(
                                    event: ChangeEvent<HTMLInputElement>
                                  ) => {
                                    handleChangeText(
                                      "table",
                                      event.target.value,
                                      index
                                    );
                                  }}
                                  onBlur={(event) => {
                                    if (
                                      event.target.value !=
                                      prevTransactionData[index].table
                                    ) {
                                      saveChargeDiscount(item._id, index);
                                    }
                                  }}
                                />
                              </div>
                            </td>
                            <td
                              className={`${styles.thData} ${styles.leftAlign}`}
                            >
                              <span className={styles.statusText}>
                                {capitalizeFirstLetter(item.status)}
                              </span>
                            </td>

                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              {item.status === "draft" && (
                                <button
                                  className={`${styles._button} ${styles.statusDraft}`}
                                  onClick={() =>
                                    updateTransStatus(item._id, "new", index)
                                  }
                                >
                                  New
                                </button>
                              )}

                              {processType === "serveToPay"
                                ? (item.status === "served" ||
                                    item.status === "paying") && (
                                    <button
                                      className={`${styles._button} ${styles.statusDraft}`}
                                      onClick={() =>
                                        handleComplete(item, index)
                                      }
                                    >
                                      Complete
                                    </button>
                                  )
                                : item.status === "served" && (
                                    <button
                                      className={`${styles._button} ${styles.statusDraft}`}
                                      onClick={() =>
                                        handleComplete(item, index)
                                      }
                                    >
                                      Complete
                                    </button>
                                  )}
                              {item.status === "cancelled" && (
                                <button
                                  className={`${styles._button} ${styles.cancelColor}`}
                                >
                                  Canceled
                                </button>
                              )}
                            </td>
                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              {formatCurrency(item.subTotal)}
                            </td>
                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              <input
                                type="number"
                                className="customTextGlobal"
                                placeholder="0"
                                value={
                                  item.charges ? item.charges.toString() : ""
                                }
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleChangeText(
                                    "charges",
                                    event.target.value,
                                    index
                                  );
                                }}
                                onBlur={(event) => {
                                  if (
                                    event.target.value !=
                                    prevTransactionData[index].charges
                                  ) {
                                    saveChargeDiscount(item._id, index);
                                  }
                                }}
                              />
                            </td>
                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              <input
                                type="number"
                                className="customTextGlobal"
                                placeholder="0"
                                value={
                                  item.discount ? item.discount.toString() : ""
                                }
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleChangeText(
                                    "discount",
                                    event.target.value,
                                    index
                                  );
                                }}
                                onBlur={(event) => {
                                  if (
                                    event.target.value !=
                                    prevTransactionData[index].discount
                                  ) {
                                    saveChargeDiscount(item._id, index);
                                  }
                                }}
                              />
                            </td>
                            {serviceFee ? (
                              <td
                                className={`${styles.thData} ${styles.middleAlign}`}
                              >
                                {serviceFee &&
                                threshold !== null &&
                                parseInt(item.total, 10) >= threshold
                                  ? fee
                                  : 0}
                              </td>
                            ) : null}
                            <td
                              className={`${styles.thData} ${styles.middleAlign}`}
                            >
                              <span className={styles.total}>
                                {formatCurrency(
                                  item.grandTotal +
                                    (serviceFee &&
                                    threshold !== null &&
                                    item.subTotal >= threshold
                                      ? fee
                                      : serviceFee
                                      ? 0
                                      : 0) || item.total
                                )}
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
                            <td colSpan={9}>
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
                                            className={`${styles.th}  ${styles.qty}`}
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
                                          <td
                                            className={`${styles.th} ${styles.openModal}`}
                                          >
                                            Edit
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
                                                className={`${styles.thData}  ${styles.qty}`}
                                              >
                                                <span
                                                  className={styles.item_qty}
                                                >
                                                  {transItem.quantity}x
                                                </span>
                                              </td>
                                              <td
                                                className={`${styles.thData} ${styles.item}`}
                                                style={{
                                                  display: "flex",
                                                  justifyContent:
                                                    "space-between",
                                                }}
                                              >
                                                <div>
                                                  <span
                                                    className={styles.title}
                                                  >
                                                    {transItem.menuItem.title}
                                                  </span>
                                                  <span
                                                    className={
                                                      styles.lineSpacing
                                                    }
                                                  >
                                                    {transItem.addons &&
                                                      transItem.addons.length >
                                                        0 && (
                                                        <ol
                                                          className={
                                                            styles.addOnsList
                                                          }
                                                          style={{
                                                            listStyleType:
                                                              "none",
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
                                                </div>
                                                <div
                                                  className={
                                                    styles.totalTransItem
                                                  }
                                                >
                                                  {formatCurrency(
                                                    transItem.menuItem.price *
                                                      transItem.quantity
                                                  )}
                                                </div>
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
                                                {transItem.status ===
                                                  "draft" && (
                                                  <>
                                                    <IconButton
                                                      onClick={() =>
                                                        updateTransactionItem(
                                                          transItem._id,
                                                          "new",
                                                          index
                                                        )
                                                      }
                                                    >
                                                      <CheckBoxIcon
                                                        style={{
                                                          color: "#008012",
                                                          fontSize: 25,
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </>
                                                )}

                                                {transItem.status ===
                                                  "ready" && (
                                                  <button
                                                    className={`${styles._buttonItem} ${styles.statusReady}`}
                                                    onClick={() =>
                                                      updateTransactionItem(
                                                        transItem._id,
                                                        "served",
                                                        index
                                                      )
                                                    }
                                                  >
                                                    Serve
                                                  </button>
                                                )}
                                                {transItem.status ===
                                                  "served" && (
                                                  <div
                                                    className={` ${styles.doneColor}`}
                                                  >
                                                    Served
                                                  </div>
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
                                              <td
                                                className={`${styles.thData} ${styles.openModal}`}
                                              >
                                                <IconButton
                                                  onClick={() =>
                                                    handleClickOpen(transItem)
                                                  }
                                                >
                                                  <MoreVertIcon
                                                    style={{
                                                      color: "#0085ff",
                                                      fontSize: 25,
                                                    }}
                                                  />
                                                </IconButton>
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
        {/* <DetailsModal
            selectedItem={selectedItem}
            transItemQty={transItemQty}
            handleClose={handleClose}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
        /> */}
        <Dialog onClose={handleClose} open={openDialog}>
          <div className={dialogStyle.container}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 0, right: 0 }}>
                <IconButton onClick={() => setOpenDialog(false)}>
                  <ClearIcon style={{ color: "#fff", fontSize: "22" }} />
                </IconButton>
              </div>
            </div>
            <DialogContent>
              <DialogContentText>
                <div>
                  {selectedItem && (
                    <>
                      <div>
                        <div>
                          <span className={dialogStyle.item}>
                            {selectedItem.menuItem.title}{" "}
                          </span>
                          <span className={dialogStyle.item}>
                            ₱{selectedItem.menuItem.price}
                          </span>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          {selectedItem.addons?.length > 0 && (
                            <>
                              <span className={dialogStyle.addOnsTitle}>
                                Add-Ons
                              </span>
                              {selectedItem.addons.map(
                                (addOn: AddOns, index: number) => {
                                  return (
                                    <div key={index} style={{ marginLeft: 20 }}>
                                      <h6 className={dialogStyle.addOns}>
                                        <span className={dialogStyle.check}>
                                          ✔
                                        </span>{" "}
                                        {addOn.title} ₱{addOn.price}
                                      </h6>
                                    </div>
                                  );
                                }
                              )}
                            </>
                          )}
                        </div>
                        <h4 style={{ color: "#fff", marginTop: 15 }}>
                          Total: {formatCurrency(selectedItem.totalPrice)}
                        </h4>
                      </div>
                      <div className={dialogStyle.center}>
                        <div className={dialogStyle.qtyContainer}>
                          <span className={dialogStyle.textqty}>Quantity</span>
                          <div className={dialogStyle.quantity}>
                            <button
                              className={`${dialogStyle.iconBtn} ${dialogStyle.iconBtnMinus}`}
                              onClick={handleDecrease}
                            >
                              <RemoveIcon
                                style={{ color: "#fff", fontSize: "25" }}
                              />
                            </button>
                            <div className={dialogStyle.qtyValue}>
                              {quantity}
                            </div>
                            <button
                              className={`${dialogStyle.iconBtn} ${dialogStyle.iconBtnPlus}`}
                              onClick={handleIncrease}
                            >
                              <AddIcon
                                style={{ color: "#fff", fontSize: "25" }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={dialogStyle.dialogBtn}>
                        <button
                          onClick={() => {
                            transItemQty("cancelled", selectedItem, undefined);
                          }}
                          className={`${dialogStyle.btn} ${dialogStyle.cancelBtn}`}
                        >
                          <DeleteOutlineIcon style={{ fontSize: "20" }} />
                          Delete this Item
                        </button>
                        <button
                          onClick={() => {
                            transItemQty(undefined, selectedItem, quantity);
                          }}
                          className={`${dialogStyle.btn} ${dialogStyle.confirmBtn}`}
                        >
                          Confirm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContentText>
            </DialogContent>
          </div>
        </Dialog>
        <Dialog open={openBeep}>
          <div className={dialogStyle.beepContainer}>
            <DialogTitle className={dialogStyle.title}>
              Make sure your speaker are on!
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <div>
                  <>
                    <div>
                      <div>
                        <span className={dialogStyle.beeptext}>
                          You'll hear a chime to let you know that a customer:
                        </span>
                      </div>
                      <div className={dialogStyle.bulletCon}>
                        <span className={dialogStyle.bullet}>
                          ● Needs attention
                        </span>
                        <span className={dialogStyle.bullet}>
                          ● Checks out their food
                        </span>
                        <span className={dialogStyle.bullet}>
                          ● Is ready to pay
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: 40 }}>
                      <span className={dialogStyle.beeptext}>
                        This will ensure you don't miss any notifications and
                        can provide excellent service to your customers.
                      </span>
                    </div>
                    <div style={{ marginTop: 40 }}>
                      <button
                        onClick={handleOnBeep}
                        className={`${dialogStyle.btn} ${dialogStyle.confirmBtn}`}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                </div>
              </DialogContentText>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    )
  );
}
