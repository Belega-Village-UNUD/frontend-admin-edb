'use client'

import SideBar from "@/components/SideBar";
import StoreList from "./StoreList";

const confirmPage = () => {

  return (
    <>
      <SideBar main={<StoreList />} />
    </>
  )
}

export default confirmPage;