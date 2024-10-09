import React from "react";
import type { NextPage } from "next";
import UserInfo from "@/components/Drawer/component/userInfo";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const UserInfoPage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <UserInfo />
    </div>
  );
};

export default UserInfoPage;
