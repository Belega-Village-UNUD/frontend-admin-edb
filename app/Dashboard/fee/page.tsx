import SideBar from "@/components/SideBar"
import FeeList from "./FeeList"

const feePage = () => {
  return (
    <>
      <SideBar main={<FeeList />} />
    </>
  )
}

export default feePage