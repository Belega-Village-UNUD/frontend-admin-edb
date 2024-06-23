"use client"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePersistedAdmin } from "@/zustand/admins"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Filter, MoreHorizontal, PencilIcon, Search, SquareCheckBig, SquareX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

type Store = {
  id: string
  user_id: string
  name: string
  user: {
    email: string
  }
  city: {
    province: string
    city_name: string
  }
  is_verified: string
  createdAt: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: Store[]
}

const columns: ColumnDef<Store>[] = [
  {
    id: "index",
    header: "No",
    cell: ({ row }) => <div className="text-center font-semibold">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    id: "Email",
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.user.email}</div>,
  },
  {
    id: "City",
    accessorKey: "city.city_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      <div className="capitalize">
        {row.original.city.city_name}, {row.original.city.province}
      </div>
    ,
  },
  {
    id: "Status",
    accessorKey: "is_verified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>
      {row.original.is_verified === 'VERIFIED' ? (
        <Badge variant='lime'>VERIFIED</Badge>
      ) : row.original.is_verified === 'DECLINED' ? (
        <Badge variant='destructive'>CANCEL</Badge>
      ) : (
        <Badge variant='default'>WAITING</Badge>
      )}
    </div>,
  },
  {
    id: "Join Store Date",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Join Store Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      <div className="capitalize">
        {format(new Date(row.original.createdAt), 'MMMM dd, yyyy')}
      </div>
    ,
  },
  {
    id: "actions",
    enableHiding: false,
  },
]

const StoreList = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [stores, setStores] = useState<Store[]>([])
  const [activeDialog, setActiveDialog] = useState('');
  const [dialogReason, setDialogReason] = useState(false);
  const [reason, setReason] = useState('');
  const router = useRouter()
  const [token] = usePersistedAdmin((state) => [state.token, state.is_logged]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error('Please Login First');
      router.push('/');
      return null;
    }
    return token;
  }, [token, router]);

  const handleGetAllStore = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson: ApiResponse = await response.json();

      if (responseJson.success === true) {
        setStores(responseJson.data)
      } else {
        console.log(responseJson.message)
      }

    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  useEffect(() => {
    handleGetAllStore()
  }, [handleGetAllStore])

  const handleConfirmStore = useCallback(async (id: string) => {
    //   console.log(id)
    // }, [])
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-store`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: id })
      })
      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.status === 200) {
        toast.success(responseJson.message);
        setActiveDialog('')
      } else {
        toast.error(responseJson.message)
        setActiveDialog('')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  const handleDeclineStore = useCallback(async (id: string, reason: string) => {
    //   console.log(id, reason)
    // }, [])
    try {
      const token = getToken();
      if (!token) { return; }
      console.log(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/declined-store`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: id, unverified_reason: reason }),
      })
      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setActiveDialog('')
        handleGetAllStore()
      } else {
        toast.error(responseJson.message)
        setActiveDialog('')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken, handleGetAllStore])

  const table = useReactTable({
    data: stores,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="lg:-mx-8 lg:mb-4 lg:px-8 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/Dashboard'}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">List Store</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:px-8 lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">List Store</h1>
          <p className="text-sm text-gray-500">
            List of all store that has been registered.
          </p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative">
          <Search className="absolute top-3 left-0 ml-2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("Email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'actions' ? (
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-24">
                              <DropdownMenuItem
                                onClick={() => {
                                  router.push(`/Dashboard/store/${row.original.id}`)
                                }}
                                className="cursor-pointer items-center"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                <span>Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-lime-600 cursor-pointer" onClick={() => setActiveDialog('confirm')}>
                                <DialogTrigger className="w-full">
                                  <div className="flex items-center" >
                                    <SquareCheckBig className="w-4 h-4 mr-2" />
                                    <span>Confirm</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setActiveDialog('decline')}>
                                <DialogTrigger className="w-full">
                                  <div className="flex items-center">
                                    <SquareX className="w-4 h-4 mr-2" />
                                    <span>Decline</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {activeDialog === 'confirm' && (
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to confirm transaction?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button variant='lime'>
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button variant='lime' onClick={() => { handleConfirmStore(row.original.user_id) }}>
                                  Confirm
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                          {activeDialog === 'decline' && (
                            <DialogContent className="sm:max-w-md" accessKey="decline">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to decline transaction?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button variant='outline'>
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button variant='lime' onClick={() => {
                                  setDialogReason(true)
                                  setActiveDialog('')
                                }}>
                                  Decline
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}

                          {dialogReason === true && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Enter Reason</DialogTitle>
                                <DialogDescription>
                                  Please enter the reason why you decline this store.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="reason" className="text-right">
                                    Unverified Reason
                                  </Label>
                                  <Input
                                    id="reason"
                                    placeholder="Enter reason here..."
                                    className="col-span-3"
                                    onChange={(e) => setReason(e.target.value)}
                                    onClick={() => handleDeclineStore(row.original.user_id, reason)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant='outline' onClick={() => setDialogReason(false)}>
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button variant='lime' onClick={() => {
                                  setDialogReason(false)
                                  setReason('reason')
                                  handleDeclineStore(row.original.user_id, reason)
                                }}>
                                  Save Reason
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : (flexRender(cell.column.columnDef.cell, cell.getContext()
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing 1 to {table.getPaginationRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StoreList