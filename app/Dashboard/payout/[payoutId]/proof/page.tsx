import SideBar from "@/components/SideBar";
import DetailPayout from "./DetailPayout";

interface DetailPayoutProps {
  params: { payoutId: string };
}
const DetailPayoutPage = ({ params }: DetailPayoutProps) => {
  return (
    <>
      <SideBar main={<DetailPayout payoutId={params.payoutId} />} />
    </>
  );
};

export default DetailPayoutPage;
