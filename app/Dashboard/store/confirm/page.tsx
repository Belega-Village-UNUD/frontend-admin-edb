'use client'

import SideBar from "@/components/SideBar";
import ConfirmList from "./ConfirmList";

const storePage = () => {

  return (
    <>
      <SideBar main={<ConfirmList />} />
    </>
  )
}

export default storePage;