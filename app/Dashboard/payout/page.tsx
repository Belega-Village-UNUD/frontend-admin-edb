'use client'

import SideBar from "@/components/SideBar";
import PayoutList from "./PayoutList";

const payoutPage = () => {

  return (
    <>
      <SideBar main={<PayoutList />} />
    </>
  )
}

export default payoutPage;