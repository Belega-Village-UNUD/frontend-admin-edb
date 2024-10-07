import { ImSpinner9 } from "react-icons/im";

export default function Loading() {
  return (
    <div className="w-full flex-1 flex justify-center items-center text-xs text-gray-500 h-[100vh]">
      <ImSpinner9 className="text-4xl text-primary text-opacity-80 animate-spin text-lime-900" />
    </div>
  );
}
