import SideBar from "@/components/SideBar";
import NewFee from "./NewFee";

const newFeePage = () => {
  return (
    <>
      <SideBar main={<NewFee />} />
    </>
  );
}

export default newFeePage;