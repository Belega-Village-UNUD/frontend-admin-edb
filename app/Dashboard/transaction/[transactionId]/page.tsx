"use client";

import SideBar from "@/components/SideBar";
import DetailsTransaction from "./DetailsTransaction";

const TransactionList = () => {
  return (
    <>
      <SideBar main={<DetailsTransaction />} />
    </>
  );
};

export default TransactionList;
