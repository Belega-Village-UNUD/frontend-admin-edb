"use client"

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePersistedAdmin } from "@/zustand/admins";
import { AvatarImage } from "@radix-ui/react-avatar";
import { CodeXml, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Store = {
  id: string
  avatar_link: string
  name: string
  user: {
    email: string
  }
  phone: string
  description: string
  address: string
  province: {
    province: string
  }
  city: {
    city_name: string
    postal_code: string
  }
  is_verified: string
  ktp_link: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: Store[]
}

const DetailStore = () => {
  const [detail, setDetail] = useState<any>({})
  const [avatar, setAvatar] = useState<string | null>(null)
  const [token] = usePersistedAdmin((state) => [state.token, state.is_logged]);

  const router = useRouter();
  const pathname = usePathname();
  const storeId = pathname.split('/').pop();

  const getToken = useCallback(() => {
    if (!token) {
      console.error('Please Login First');
      router.push('/');
      return null;
    }
    return token;
  }, [token, router]);

  const handleGetOneStore = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/admin?store_id=${storeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const responseJson: ApiResponse = await response.json();

      if (responseJson.success === true) {
        if (Array.isArray(responseJson.data) && responseJson.data.length > 0) {
          setDetail(responseJson.data[0]);
          setAvatar(responseJson.data[0].avatar_link);
          return;
        } else {
          console.error('Data is not an array or is empty');
        }
      } else {
        console.error(responseJson.message)
        localStorage.clear()
      }
      console.log(detail)

    } catch (error: any) {
      console.error(error.message)
    }
  }, [getToken, storeId, detail])

  useEffect(() => {
    handleGetOneStore()
  }, [handleGetOneStore])

  return (
    <div className="lg:px-8 sm:px-6">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/store'}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/Dashboard/store'}>All Store</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Detail Store</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">Detail Store</h1>
          <p className="text-sm text-gray-500">
            Detail of transaction with ID <span className="text-lime-600">{storeId}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">

          <div className="flex items-center gap-4">
            {avatar ? (
              <Avatar>
                <AvatarImage src={avatar} alt="avatar" />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
              </Avatar>
            )}

            <div>
              <p className="font-semibold">{detail.name}</p>
              <p className="text-sm opacity-60">{detail.user?.email}</p>
            </div>
          </div>

        </div>

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
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Description Store</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {detail.description}
              </p>
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
                {detail.address}, {detail.city?.city_name}, {detail.province?.province}. {detail.city?.postal_code}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 pb-1">
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Postal Code</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {detail.city?.postal_code}
              </p>
            </div>
          </div>

        </div>

        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">

          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Status</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {detail.is_verified === 'VERIFIED' ? (
                  <Badge variant='lime'>VERIFIED</Badge>
                ) : detail.is_verified === 'DECLINED' ? (
                  <Badge variant='destructive'>CANCEL</Badge>
                ) : (
                  <Badge variant='default'>WAITING</Badge>
                )}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 pb-1">
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">KTP Image</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <div className="flex-wrap">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='ghost' className="relative w-[300px] h-[150px] top-0 mt-4">
                      <Image src={detail.ktp_link} alt="ktp" fill className="rounded-xl relative object-cover" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Image src={detail.ktp_link} alt="ktp" width={10000} height={3000} className="rounded-xl my-4" />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

        </div>

      </div >
    </div >
  )
}

export default DetailStore;
