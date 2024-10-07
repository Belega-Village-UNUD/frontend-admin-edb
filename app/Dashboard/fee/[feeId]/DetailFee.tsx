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
  Text,
  Type,
  Info,
  MapPin,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DetailFee = () => {
  const [token, setToken] = usePersistedAdmin((state) => [
    state.token,
    state.is_logged,
  ]);

  const pathname = usePathname();
  const feeId = pathname.split("/").pop();
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
        `${process.env.NEXT_PUBLIC_API_URL}/fee?fee_id=${feeId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenStore}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-admin-detail-fee", feeId, tokenStore],
    enabled: !!tokenStore,
  });

  if (!tokenStore) {
    return <Loading />;
  }

  if (isFetching) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
              <BreadcrumbLink href="/Dashboard/fee">List Fee</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Detail Fee
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Detail Fee
          </h1>
          <p className="text-sm text-gray-500">
            Detail of transaction with ID{" "}
            <span className="text-lime-600">{feeId}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <Type className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Name</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.name}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 pb-1">
              <Text className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Description Fee</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.description}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 pb-1">
              <Info className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Interest</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.interest}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFee;
