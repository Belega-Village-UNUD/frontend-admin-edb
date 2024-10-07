'use client'

import SideBar from "@/components/SideBar";
import ConfirmList from "./ConfirmList";

const confirmPage = () => {

  return (
    <>
      <SideBar main={<ConfirmList />} />
    </>
  )
}

export default confirmPage;