"use client";

import { FileUploader } from "@/components/FileUploader";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import CurrencyText from "@/components/CurrencyText";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataURLToFile } from "@/lib/utils";
import { usePersistedAdmin } from "@/zustand/admins";
import {
  Banknote,
  CheckCircle,
  CreditCard,
  DollarSignIcon,
  Store,
  User,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface Props {
  payoutId: string;
}

const DetailPayout = ({ payoutId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [token] = usePersistedAdmin((state) => [state.token]);
  const [payout, setPayout] = useState<any>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // console.log('line 33: ', uploadedImageUrl);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please Login First");
      // router.push("/");
      return null;
    }
    return token;
  }, [token, router]);

  const handleGetDetailPayout = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/admin?id=${payoutId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();

      if (responseJson.success === true) {
        if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
          setPayout(responseJson.data[0]);
        } else {
          console.error("Data is not an array or is empty");
        }
      } else {
        console.error(responseJson.message);
        // localStorage.clear();
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [getToken, payoutId]);

  useEffect(() => {
    handleGetDetailPayout();
  }, [handleGetDetailPayout]);

  const [image, setImage] = useState<File>();
  const handleFileChange = (newFiles: File) => {
    setImage(newFiles);
  };
  const handlePostProofPayout = useCallback(
    async (data: any) => {
      if (!image || !data) {
        toast.error("Please fill all data");
        return;
      }
      try {
        data.is_preorder = data.is_preorder === "true";

        const formData = new FormData();
        formData.append("payout_id", payoutId);
        formData.append("proof", image);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payout/admin/proof`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          // toast.success(response.message);
          router.push("/store/product");
        } else {
          // toast.error(responseJson.message);
        }
      } catch (error: any) {}
    },
    [image, token, router]
  );

  return (
    <div className="lg:px-8 sm:px-6">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/Dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/Dashboard/payout">
                List Payout
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Send Proof Payout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Send Payout Proof
          </h1>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div>
            <div className="flex items-center gap-4 pb-1">
              <span className="font-semibold">Proof payout</span>
            </div>
            <div className="flex gap-4">
              <FileUploader
                // value={[image]}
                onValueChange={handleFileChange}
                maxFiles={1}
                multiple={false}
                maxSize={4 * 1024 * 1024}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPayout;
