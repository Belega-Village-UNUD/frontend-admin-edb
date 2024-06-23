'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePersistedAdmin } from "@/zustand/admins"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { ArrowUpDown, Filter, MoreHorizontal, PencilIcon, Search, SquareX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type Fee = {
  id: string
  name: string
  interest: number
  description: string
}

type ApiResponse = {
  success: boolean
  message: string
  data: Fee[]
}

const columns: ColumnDef<Fee>[] = [
  {
    id: "index",
    header: "No",
    cell: ({ row }) => <div className="text-center font-semibold">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    accessorKey: "name",
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
    id: "Interest",
    accessorKey: "interest",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Interest
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.interest} %</div>,
  },
  {
    id: "Description",
    accessorKey: "interest",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
  },
]

const FeeList = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeDialog, setActiveDialog] = useState('');
  const router = useRouter()

  const [fees, setFees] = useState<Fee[]>([])
  const [token] = usePersistedAdmin((state) => [state.token])

  const getToken = useCallback(() => {
    if (!token) {
      console.error('Please Login First');
      router.push('/');
      return null;
    }
    return token;
  }, [token, router]);

  const getAllFees = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fee`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const responseJson: ApiResponse = await response.json();

      if (responseJson.success === true) {
        setFees(responseJson.data);
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getAllFees()
  })

  const table = useReactTable({
    data: fees,
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
                              <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setActiveDialog('delete')}>
                                <DialogTrigger className="w-full">
                                  <div className="flex items-center">
                                    <SquareX className="w-4 h-4 mr-2" />
                                    <span>Delete</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {activeDialog === 'delete' && (
                            <DialogContent className="sm:max-w-md" accessKey="decline">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to delete fee?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button variant='outline'>
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button variant='lime' >
                                  Decline
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
  );
};

export default FeeList;