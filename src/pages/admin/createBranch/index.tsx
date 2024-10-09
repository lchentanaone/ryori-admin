import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import CreateStore from "@/components/CreateStoreBranch/setupstore";
import { Grid, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import style from "styled-jsx/style";

const SetUpStore: NextPage = () => {
  const [errors, setErrors] = useState("");
  const [branchData, setBranchData] = useState({
    branchName: "",
    email: "",
    address: "",
    contactNumber: "",
  });

  const handleAddBranch = async () => {
    const token = await localStorage.getItem("token");
    const store_Id = await localStorage.getItem("store_Id");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            branchName: branchData.branchName,
            email: branchData.email,
            contactNumber: branchData.contactNumber,
            address: branchData.address,
            store_Id: store_Id,
          }),
        }
      );
      const data = await response.json();
      await localStorage.setItem("branch_Id", data._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!branchData.branchName) {
      setErrors("Branch name must be provided");
    } else {
      setErrors("");
      await handleAddBranch();
      window.location.href = "/admin/selectBranch";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBranchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (!existingToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" style={{ marginBottom: 20 }}>
              Add new Branch
            </Typography>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              label="Branch Name"
              variant="outlined"
              fullWidth
              value={branchData.branchName}
              name="branchName"
              onChange={handleChange}
              required
              margin="normal"
              style={{ marginRight: "10px" }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={branchData.email}
              name="email"
              onChange={handleChange}
              required
              type="email"
              margin="normal"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              name="address"
              value={branchData.address}
              onChange={handleChange}
              required
              margin="normal"
              style={{ marginRight: "10px" }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={branchData.contactNumber}
              name="contactNumber"
              onChange={handleChange}
              required
              margin="normal"
            />
          </div>

          <button className="button-primary" onClick={handleSave}>
            Save
          </button>
          {errors !== "" && (
            <p style={{ color: "#ff0000", top: -7 }}>{errors}</p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SetUpStore;
