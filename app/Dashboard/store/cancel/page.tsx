'use client'

import SideBar from "@/components/SideBar";
import DeclinedList from "./DeclinedList";

const storePage = () => {

  return (
    <>
      <SideBar main={<DeclinedList />} />
    </>
  )
}

export default storePage;