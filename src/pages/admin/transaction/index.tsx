import TemporaryDrawer from "@/components/Drawer/Drawer";
import DailyTransaction from "@/components/Drawer/component/transaction";
import React from "react";

const DailyTrasactionPage: React.FC = () => {
  return (
    <div>
      <TemporaryDrawer />
      <DailyTransaction />
    </div>
  );
};

export default DailyTrasactionPage;
