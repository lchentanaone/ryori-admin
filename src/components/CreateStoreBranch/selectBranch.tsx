import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Grid, Paper, Typography } from "@mui/material";
import style from "./style.module.css";

interface Store_data {
  _id: string;
  storeName: string;
}
interface Branch_data {
  _id: string;
  branchName: string;
}

const SelectBranch: React.FC = () => {
  const [storeData, setStoreData] = useState<Store_data>();
  const [branchData, setBranchData] = useState<Branch_data[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
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
      console.log({ data });
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };
  const fetchBranchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const store_Id = localStorage.getItem("store_Id");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch?store_Id=${store_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        window.location.href = "/";
      }
      const branch = await response.json();
      setBranchData(branch);
    } catch (error) {
      console.error("Error fetching branch data:", error);
      console.log({ error });
    }
  };

  const handleBranchSelection = async (branch_Id: any) => {
    try {
      await localStorage.setItem("branch_Id", branch_Id);

      window.location.href = "/admin/dashboard/";
    } catch (error) {
      console.error(error);
    }
  };

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

  const init = async () => {
    await fetchStoreData();
    fetchBranchData();
  };
  useEffect(() => {
    init();
    fetchUserData();
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh", flexDirection: "column" }}
      >
        <Grid item xs={12} sm={8} md={3}>
          <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h5">
              {storeData && storeData.storeName}
            </Typography>

            <Typography variant="subtitle2">Select Branch</Typography>
            {branchData.map((branch, index) => (
              <button
                key={index}
                className={style.branch_btn}
                onClick={() => handleBranchSelection(branch._id)}
              >
                {branch.branchName}
              </button>
            ))}
            <Link href={"/admin/createBranch"}>
              <button className={style.addbranch_btn}>Add new Branch</button>
            </Link>
          </Paper>
        </Grid>
        <div style={{ marginTop: 20 }}>
          <button className="logut" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </Grid>
    </div>
  );
};

export default SelectBranch;
