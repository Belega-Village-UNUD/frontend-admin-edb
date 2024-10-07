"use client";

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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const DetailPayout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const payoutId = pathname.split("/").pop();

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

  const handleConfirmPayout = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/admin/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payout_id: payoutId,
          }),
        }
      );
      const responseJson = await response.json();

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        handleGetDetailPayout();
      } else {
        toast.error(responseJson.message);
        console.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [getToken, payoutId, handleGetDetailPayout]);

  const handleRemoveClick = () => {
    setUploadedImageUrl(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofPayout = useCallback(async () => {
    // console.log('line 93: ', e);
    const file =
      uploadedImageUrl && dataURLToFile(uploadedImageUrl, "proof.png");
    const formData = new FormData();
    // @ts-ignore
    formData.append("payout_id", payoutId);
    // @ts-ignore
    formData.append("proof", file);

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/admin/proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const responseJson = await response.json();

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        handleGetDetailPayout();
      } else {
        toast.error(responseJson.message);
        console.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [uploadedImageUrl, payoutId, getToken, handleGetDetailPayout]);

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
                Detail Payout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Detail Payout
          </h1>
          <p className="text-sm text-gray-500">
            Detail payout with ID{" "}
            <span className="text-lime-600">{payoutId}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div>
            <div className="flex items-center gap-4 pb-1">
              <DollarSignIcon className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Amount Payload</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70 text-2xl font-black">
                <CurrencyText amount={payout.amount} />
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div>
            <div className="flex items-center gap-4 pb-1">
              <Store className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Store Name</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{payout.store?.name}</p>
            </div>
          </div>
        </div>

        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <User className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Account Name</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{payout.store_bank?.account_name}</p>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <Banknote className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Bank</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{payout.store_bank?.bank_name}</p>
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <CreditCard className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Account Number</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{payout.store_bank?.account_number}</p>
            </div>
          </div>
        </div>

        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div>
            <div className="flex items-center gap-4 pb-1">
              <CheckCircle className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Status</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {payout.status === "SUCCESS" ? (
                  <Badge variant="lime">SUCCESS</Badge>
                ) : payout.status === "CANCEL" ? (
                  <Badge variant="destructive">CANCEL</Badge>
                ) : payout.status === "PENDING" ? (
                  <Badge variant="default">PENDING</Badge>
                ) : (
                  <Badge variant="default">ONGOING</Badge>
                )}
              </p>
            </div>
          </div>
        </div>

        {payout.status === "PENDING" && (
          <div onClick={() => handleConfirmPayout()}>
            {" "}
            <ButtonConfirm label="Confirm Payout" />
          </div>
        )}

        {payout.status === "ONGOING" && (
          <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
            <Label htmlFor="proof">Proof Image</Label>
            <Input
              className="mt-4"
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {uploadedImageUrl && (
              <div className="mt-2 relative flex justify-center ">
                <Image
                  src={uploadedImageUrl}
                  alt="Preview"
                  width={500}
                  height={500}
                />
                <button
                  onClick={handleRemoveClick}
                  className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 aspect-square w-8"
                  aria-label="Remove image"
                >
                  X
                </button>
              </div>
            )}
            {!uploadedImageUrl && payout.payment_proof && (
              <div className="mt-2 relative flex justify-center">
                <Image
                  src={payout.payment_proof}
                  alt="Preview"
                  width={500}
                  height={500}
                />
                <button
                  onClick={handleRemoveClick}
                  className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 aspect-square w-8"
                  aria-label="Remove image"
                >
                  X
                </button>
              </div>
            )}
            <div className="pt-6">
              {" "}
              <ButtonConfirm
                label="Confirm Payout"
                onClick={handleProofPayout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPayout;
