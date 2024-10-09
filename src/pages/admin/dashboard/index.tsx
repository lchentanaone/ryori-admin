import React from "react";
import type { NextPage } from "next";
import Dashboard from "@/components/Drawer/component/dashboard";
import TemporaryDrawer from "@/components/Drawer/Drawer";
import { Grid } from "@mui/material";

const DashboardPage: NextPage = () => {
  return (
    <>
      <TemporaryDrawer />
      <Dashboard />
    </>
    // <Grid container>
    //   <Grid item xs={6}>

    //   </Grid>
    //   <Grid item xs={6}>

    //   </Grid>
    // </Grid>
  );
};

export default DashboardPage;
