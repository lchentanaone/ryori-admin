import React from "react";
import type { NextPage } from "next";
import Categories from "@/components/Drawer/component/categories";
import TemporaryDrawer from "@/components/Drawer/Drawer";

const CategoryPage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <Categories />
    </div>
  );
};

export default CategoryPage;
