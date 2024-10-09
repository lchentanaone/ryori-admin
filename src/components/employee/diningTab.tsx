import React, { useState, useEffect } from "react";
import Image from "next/image";
import ryori from "./../../../public/ryoriLogo.png";
import Profile from "./profile";
import Inventory from "../Drawer/component/inventory";
import Orders from "./dining/orders";
import PreparingOrders from "./kitchen/preparingOrders";
import DoneOrders from "./dining/doneOrders";
import styles from "./styles.module.css";

interface CustomTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CustomTab({ label, active, onClick }: CustomTabProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: active ? "#db1b1b" : "gray",
        cursor: "pointer",
        color: "#fff",
        marginRight: "10px",
        borderRadius: "4px",
        width: 170,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <div className={styles.tabLabel}>{label}</div>
    </div>
  );
}

function DiningTab() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  React.useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  // Checker
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div style={{ width: "100%", padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginTop: -12 }}>
          <Image src={ryori} alt="ryori" width={160} height={65} />
        </div>
        <div style={{ display: "flex" }}>
          <CustomTab
            label="Orders"
            active={activeTab === 0}
            onClick={() => handleTabClick(0)}
          />
          <CustomTab
            label="Done Orders"
            active={activeTab === 1}
            onClick={() => handleTabClick(1)}
          />

          <CustomTab
            label="Profile"
            active={activeTab === 2}
            onClick={() => handleTabClick(2)}
          />
        </div>
      </div>
      <div style={{ marginTop: 50 }}>
        <div style={{ display: activeTab === 0 ? "block" : "none" }}>
          <Orders />
        </div>
        <div style={{ display: activeTab === 1 ? "block" : "none" }}>
          <DoneOrders />
        </div>
        <div style={{ display: activeTab === 2 ? "block" : "none" }}>
          <Profile />
        </div>
      </div>
    </div>
  );
}

export default DiningTab;
