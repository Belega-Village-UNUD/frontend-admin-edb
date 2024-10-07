'use client'

import SideBar from "@/components/SideBar";
import Dashboard from "./Dashboard";

const storeProductPage = () => {
  return (
    <>
      <SideBar main={<Dashboard />} />
    </>
  )
}

export default storeProductPage;