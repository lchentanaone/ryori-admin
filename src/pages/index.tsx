"use client";

import React from "react";
import Head from "next/head";
import LoginPage from "./login";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Ryori</title>
      </Head>
      <div className="flex flex-col min-h-[100vh]">
        <main className="flex-grow  md:mt-10">
          <LoginPage />
        </main>
      </div>
    </>
  );
};

export default Layout;
