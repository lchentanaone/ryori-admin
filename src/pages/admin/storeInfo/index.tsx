import TemporaryDrawer from "@/components/Drawer/Drawer";
import StoreInfo from "@/components/CreateStoreBranch/storeSetting";
import React from "react";

const StoreSettingPage: React.FC = () => {
  return (
    <div>
      <TemporaryDrawer />
      <StoreInfo />
    </div>
  );
};

export default StoreSettingPage;
