'use client'

import SideBar from "@/components/SideBar";
import DeclinedList from "./DeclinedList";

const cancelPage = () => {

  return (
    <>
      <SideBar main={<DeclinedList />} />
    </>
  )
}

export default cancelPage;