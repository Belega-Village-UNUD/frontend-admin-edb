"use client";

import Loading from "@/components/Loading";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePersistedAdmin } from "@/zustand/admins";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CheckCircle,
  CodeXml,
  ImageIcon,
  Info,
  MapPin,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Store = {
  id: string;
  avatar_link: string;
  name: string;
  user: {
    email: string;
  };
  phone: string;
  description: string;
  address: string;
  province: {
    province: string;
  };
  city: {
    city_name: string;
    postal_code: string;
  };
  is_verified: string;
  ktp_link: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Store[];
};

const DetailStore = () => {
  const [token, setToken] = usePersistedAdmin((state) => [
    state.token,
    state.is_logged,
  ]);

  const pathname = usePathname();
  const storeId = pathname.split("/").pop();
  const [tokenStore, setTokenStore] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setTokenStore(token);
    }
  }, [token]);

  const {
    isFetching,
    data: detail,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/admin?store_id=${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data?.data[0];
    },
    queryKey: ["get-admin-detail-store", storeId, tokenStore],
    enabled: !!tokenStore,
  });

  const {
    isFetching: isFetchingBank,
    data: detailBank,
    error: errorBank,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bank/admin?store_id=${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data?.data;
    },
    queryKey: ["get-admin-detail-bank", storeId, tokenStore],
    enabled: !!tokenStore,
  });

  if (!tokenStore) {
    return <Loading />;
  }

  if (isFetching) {
    return <Loading />;
  }
  if (isFetching || (isFetchingBank && detailBank != undefined)) {
    return <Loading />;
  }

  if (error || errorBank) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="lg:px-8 sm:px-6">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/Dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/Dashboard/store">
                List Store
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Detail Store
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Detail Store
          </h1>
          <p className="text-sm text-gray-500">
            Detail of transaction with ID{" "}
            <span className="text-lime-600">{storeId}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <CodeXml className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Phone Number</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.phone}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 pb-1">
              <Info className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Description Store</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.description}</p>
            </div>
          </div>
        </div>

        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div>
            <div className="flex items-center gap-4 pb-1">
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Address Store</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {detail.address}, {detail.city?.city_name},{" "}
                {detail.province?.province}. {detail.city?.postal_code}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 pb-1">
              <Tag className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Postal Code</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.city?.postal_code}</p>
            </div>
          </div>
        </div>

        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <CheckCircle className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Status</span>
            </div>
            <div className="flex gap-4">
              <div className="w-4 h-4"></div>
              <div className="opacity-70">
                {detail.is_verified === "VERIFIED" ? (
                  <Badge variant="lime">VERIFIED</Badge>
                ) : detail.is_verified === "DECLINED" ? (
                  <Badge variant="destructive">CANCEL</Badge>
                ) : (
                  <Badge variant="default">WAITING</Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 pb-1">
              <ImageIcon className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">KTP Image</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <div className="flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative w-[300px] h-[150px] top-0 mt-4"
                    >
                      <Image
                        src={detail.ktp_link}
                        alt="ktp"
                        fill
                        className="rounded-xl relative object-cover"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Image
                      src={detail.ktp_link}
                      alt="ktp"
                      width={10000}
                      height={3000}
                      className="rounded-xl my-4"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        {/* bank */}
        {detailBank != null ? (
          <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
            <div>
              <div className="flex items-center gap-4 pb-1">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span className="font-semibold">Bank Account</span>
              </div>
              {detailBank && detailBank.length > 0 ? (
                detailBank.map((data: any, index: number) => (
                  <div key={index} className="flex flex-col">
                    <p className="w-full flex flex-row font-semibold text-base gap-2">
                      <span>{`${index + 1}. `}</span>
                      <span>Bank Name: </span>
                      <span>
                        ({data.bank_code}) {data.bank_name}
                      </span>
                    </p>
                    <p className="w-full flex flex-row gap-2 text-base mb-3">
                      <span>Bank Account:</span>
                      <span>
                        {data.account_number} - {data.account_name}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-base text-red-500">
                  No bank accounts found.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DetailStore;
