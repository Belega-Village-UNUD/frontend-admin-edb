'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePersistedAdmin } from "@/zustand/admins";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type newFeeProps = {
  id: number;
  name: string;
  interest: number;
  description: string;
}

const NewFee = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();

  const [fees, setFees] = useState<newFeeProps[]>([])
  const [token] = usePersistedAdmin((state) => [state.token])

  const getToken = useCallback(() => {
    if (!token) {
      console.error('Please Login First');
      router.push('/');
      return null;
    }
    return token;
  }, [token, router]);

  const handleCreateNewFee: SubmitHandler<FieldValues> = useCallback(async (data) => {
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          interest: data.interest,
          description: data.description,
        })
      })
      const responseJson = await response.json();
      console.log(responseJson.data)
      if (responseJson.status === 200) {
        toast.success(responseJson.message)
        router.push('/Dashboard/fee')
      } else {
        toast.error(responseJson.message)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken, router])

  return (
    <div className="lg:px-8 sm:px-6">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/Dashboard'}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/Dashboard/fee'}>All Fee</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Create New Fee</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">Create New Fee</h1>
          <p className="text-sm text-gray-500">
            Create a new fee for your seller transaction.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <form onSubmit={handleSubmit(handleCreateNewFee)}>
            <div className="md:p-6 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
              <h3 className="text-base font-semibold">Information Product</h3>

              <div className="space-y-12 sm:space-y-16">
                <div className="mt-5 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label htmlFor="product-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      Fee Name
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="product-name"
                        autoComplete="product-name"
                        {...register('name')}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      Interest
                    </label>
                    <div className="flex gap-2 mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register('interest', {
                          required: true,
                          valueAsNumber: true,
                        })}
                        className="block max-w-16 rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-800 sm:text-sm sm:leading-6"
                        placeholder="2"
                        min='1'
                        max='100'
                        required
                      />
                      <div className="pointer-events-none inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-800 sm:text-xl" id="weight">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label htmlFor="description-product" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      Description
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="block w-full max-w-2xl rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                        required
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">Write description fee.</p>
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-end gap-x-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    <Link href="/Dashboard/fee">
                      Cancel
                    </Link>
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-lime-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-800"
                  >
                    Confirm Fee
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewFee