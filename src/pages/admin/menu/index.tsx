import MenuCard from "@/components/Drawer/component/menu/menu";
import React from "react";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const MenuPage: React.FC = () => {
  return (
    <div>
      <TemporaryDrawer />
      <MenuCard />
    </div>
  );
};

export default MenuPage;
