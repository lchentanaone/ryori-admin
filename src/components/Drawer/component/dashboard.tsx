import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { Typography } from "@mui/material";
import DoughnutChart from "./../chart";

interface Store_data {
  _id: string;
  storeName: string;
}
interface Branch_data {
  _id: string;
  branchName: string;
}
interface DashboardData {
  _id: string;
  orderSummary: {
    today: {
      draft: number;
      cooking: number;
      served: number;
      done: number;
      cancelled: number;
      awaiting_payment: number;
    };
    weekly: {
      draft: number;
      cooking: number;
      served: number;
      done: number;
      cancelled: number;
      awaiting_payment: number;
    };
    monthly: {
      draft: number;
      cooking: number;
      served: number;
      done: number;
      cancelled: number;
      awaiting_payment: number;
    };
    // Add other filter types here if needed
  };
  new: number;
  totalMenus: string;
  totalOrders: string;
  totalCustomers: string;
  totalRevenues: string;
}

const Dashboard = () => {
  const [storeData, setStoreData] = useState<Store_data>();
  const [branchData, setBranchData] = useState<Branch_data>();
  const [dashboard, setDashboard] = useState<DashboardData>();
  const [consumption, setConsumption] = useState(0);
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [preparing, setPreparing] = useState(0);
  const [served, setServed] = useState(0);
  const [doneOrder, setDoneOrder] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [waitingPayment, setWaitingPayment] = useState(0);

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/${store_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setStoreData(data);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  const fetchBranchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const branch = await response.json();
      setBranchData(branch);
      setUsed(branch.used);
      setLimit(branch.limit);
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const branch_Id = localStorage.getItem("branch_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard?bid=${branch_Id}&sid=${store_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dashBranch = await response.json();
      setDashboard(dashBranch);
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };

  useEffect(() => {
    fetchStoreData();
    fetchBranchData();
    fetchDashboard();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    dashboard && dashboard.orderSummary && changeFilter("today");
  }, [dashboard]);

  const changeFilter = (type: "today" | "weekly" | "monthly") => {
    setNewOrders(dashboard?.orderSummary[type]?.draft || 0);
    setPreparing(dashboard?.orderSummary[type]?.cooking || 0);
    setServed(dashboard?.orderSummary[type]?.served || 0);
    setDoneOrder(dashboard?.orderSummary[type]?.done || 0);
    setCancelled(dashboard?.orderSummary[type]?.cancelled || 0);
    setWaitingPayment(dashboard?.orderSummary[type]?.awaiting_payment || 0);
  };

  const init = async () => {
    await fetchStoreData();
    fetchBranchData();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div style={{ paddingLeft: 250, paddingRight: 250 }}>
        <div className={style.dashHead}>
          <div className={style.storeName}>{storeData?.storeName}</div>
          <div className={style.bName}>{branchData?.branchName}</div>
        </div>
        {/* <Typography variant="h5">Dashboard</Typography> */}
        <div className={style.flex_row}>
          <div className={style.dashBox}>
            <div className={style.label}>Total Menus</div>
            <h4 className={style.int_value}>
              {dashboard && dashboard.totalMenus}
            </h4>
          </div>

          <div className={style.dashBox}>
            <div className={style.label}>Total Orders</div>
            <h4 className={style.int_value}>
              {dashboard && dashboard.totalOrders}
            </h4>
          </div>
          <div className={style.dashBox}>
            <div className={style.label}>Total Customers</div>
            <h4 className={style.int_value}>
              {dashboard && dashboard.totalCustomers}
            </h4>
          </div>
          <div className={style.dashBox}>
            <div className={style.label}>Total Revenues</div>
            <h4 className={style.int_value}>
              {dashboard && dashboard.totalRevenues}
            </h4>
          </div>
        </div>
        <div className={`${style.flex_row}`}>
          <div className={`${style.con} ${style.con_padding}`}>
            <div className={style.flex_row}>
              <h4>Order Summary</h4>
              <div className={style.filter}>
                <button
                  className={style.filter_btn}
                  onClick={() => changeFilter("monthly")}
                >
                  Monthly
                </button>
                &nbsp; | &nbsp;
                <button
                  className={style.filter_btn}
                  onClick={() => changeFilter("weekly")}
                >
                  Weekly
                </button>
                &nbsp;| &nbsp;
                <button
                  className={style.filter_btn}
                  onClick={() => changeFilter("today")}
                >
                  Today
                </button>
              </div>
            </div>
            <div className={`${style.flex_row}`}>
              <div className={`${style.summaryInfo} ${style.new} ${style.gap}`}>
                <h4 className={style.int_value}>{newOrders}</h4>
                <div className={style.label_status}>Draft</div>
              </div>
              <div
                className={`${style.summaryInfo} ${style.preparing} ${style.gap}`}
              >
                <h4 className={style.int_value}>{preparing}</h4>
                <div className={style.label_status}>Cooking</div>
              </div>
              <div
                className={`${style.summaryInfo} ${style.served} ${style.gap}`}
              >
                <h4 className={style.int_value}>{served}</h4>
                <div className={style.label_status}>Served</div>
              </div>
            </div>
            <div className={`${style.flex_row}`}>
              <div
                className={`${style.summaryInfo} ${style.waiting_payment} ${style.gap}`}
              >
                <h4 className={style.int_value}>{waitingPayment}</h4>
                <div className={style.label_status}>Waiting for Payment</div>
              </div>
              <div
                className={`${style.summaryInfo} ${style.done} ${style.gap}`}
              >
                <h4 className={style.int_value}>{doneOrder}</h4>
                <div className={style.label_status}>Done</div>
              </div>
              <div
                className={`${style.summaryInfo} ${style.cancelled} ${style.gap}`}
              >
                <h4 className={style.int_value}>{cancelled}</h4>
                <div className={style.label_status}>Cancelled</div>
              </div>
            </div>
          </div>
          <div className={`${style.con} ${style.con_padding}`}>
            <h4>Consumption</h4>
            <div className={`${style.con_padding2}`}>
              <div style={{ width: "200px", height: "200px" }}>
                <DoughnutChart />
                <div className={`${style.consumptions}`}>
                  <h6>
                    {used} of {limit}
                  </h6>
                  <h6>Transactions</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
