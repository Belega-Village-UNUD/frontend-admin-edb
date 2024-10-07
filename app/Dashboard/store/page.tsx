'use client'

import SideBar from "@/components/SideBar";
import StoreList from "./StoreList";

const storePage = () => {

  return (
    <>
      <SideBar main={<StoreList />} />
    </>
  )
}

export default storePage;