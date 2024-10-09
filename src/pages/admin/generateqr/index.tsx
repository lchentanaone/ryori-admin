import React from "react";
import type { NextPage } from "next";
import TemporaryDrawer from "@/components/Drawer/Drawer";
import QRGenerator from "@/components/Drawer/component/generateQr";

const QRGeneratorPage: NextPage = () => {
  return (
    <div>
      <TemporaryDrawer />
      <QRGenerator />
    </div>
  );
};

export default QRGeneratorPage;
