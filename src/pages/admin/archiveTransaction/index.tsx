import React from "react";
import type { NextPage } from "next";
import ArchiveTransaction from "@/components/Drawer/component/archive";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const ArchiveTransactionPage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <ArchiveTransaction />
    </div>
  );
};

export default ArchiveTransactionPage;
