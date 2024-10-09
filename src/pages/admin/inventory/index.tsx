import React from "react";
import type { NextPage } from "next";
import Inventory from "@/components/Drawer/component/inventory";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const InventroyPage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <Inventory />
    </div>
  );
};

export default InventroyPage;
