"use client";

import SideBar from "@/components/SideBar";
import TransactionList from "./TransactionList";

const storePage = () => {
  return (
    <>
      <SideBar main={<TransactionList />} />
    </>
  );
};

export default storePage;
