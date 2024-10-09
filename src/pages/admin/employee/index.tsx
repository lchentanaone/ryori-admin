import React from "react";
import type { NextPage } from "next";
import EmployeeTable from "@/components/Drawer/component/employee";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const EmployeePage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <EmployeeTable />
    </div>
  );
};

export default EmployeePage;
