"use client";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePersistedAdmin } from "@/zustand/admins";
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
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  PencilIcon,
  Search,
  SquareCheckBig,
  SquareX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Payout = {
  id: string;
  store: {
    name: string;
  };
  payout_bank: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  status: string;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Payout[];
};

const columns: ColumnDef<Payout>[] = [
  {
    id: "index",
    header: "No",
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.index + 1}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "payout_name",
    accessorKey: "store.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payout Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row?.original?.store?.name}</div>,
  },
  {
    id: "Bank",
    accessorKey: "payout_bank.bank_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // @ts-ignore
    cell: ({ row }) => <div>{row?.original?.store_bank?.bank_name}</div>,
  },
  {
    id: "Status",
    accessorKey: "status",
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
      );
    },
    cell: ({ row }) => (
      <div>
        {row.original.status === "SUCCESS" ? (
          <Badge variant="lime">SUCCESS</Badge>
        ) : row.original.status === "CANCEL" ? (
          <Badge variant="destructive">CANCEL</Badge>
        ) : row.original.status === "ONGOING" ? (
          <Badge variant="default">ONGOING</Badge>
        ) : (
          <Badge variant="secondary">PENDING</Badge>
        )}
      </div>
    ),
  },
  {
    id: "Request Date",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Request Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {format(new Date(row.original.createdAt), "MMMM dd, yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
  },
];

const PayoutList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeDialog, setActiveDialog] = useState("");
  const [dialogReason, setDialogReason] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const [token] = usePersistedAdmin((state) => [state.token, state.is_logged]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please Login First");
      // router.push("/");
      return null;
    }
    return token;
  }, [token, router]);

  const handleGetAllPayout = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payout/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson: ApiResponse = await response.json();

      if (responseJson.success === true) {
        setPayouts(responseJson.data);
      } else {
      }
    } catch (error: any) {}
  }, [getToken]);
  console.log(payouts);
  useEffect(() => {
    handleGetAllPayout();
  }, [handleGetAllPayout]);

  const handleConfirmPayout = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payout/admin/confirm`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payout_id: id }),
          }
        );
        const responseJson = await response.json();
        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          setActiveDialog("");
          window.location.reload();
        } else {
          toast.error(responseJson.message);
          setActiveDialog("");
        }
      } catch (error: any) {
        toast.error("something wrong");
      }
    },
    [token]
  );

  const handleDeclinePayout = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/declined-payout`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ payout_id: id }),
          }
        );
        const responseJson = await response.json();
        if (responseJson.success === true) {
          toast.success(responseJson.message);
          setActiveDialog("");
          window.location.reload();
        } else {
          toast.error(responseJson.message);
          setActiveDialog("");
        }
      } catch (error: any) {}
    },
    [token]
  );

  const table = useReactTable({
    data: payouts,
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
  });

  return (
    <div className="w-full">
      <div className="lg:-mx-8 lg:mb-4 lg:px-8 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={"/Dashboard"}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                List payout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:px-8 lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            List Payout
          </h1>
          <p className="text-sm text-gray-500">List of payout payout</p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative">
          <Search className="absolute top-3 left-0 ml-2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Filter payout name..."
            value={
              (table.getColumn("payout_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("payout_name")?.setFilterValue(event.target.value)
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
                );
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
                  );
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
                      {cell.column.id === "actions" ? (
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
                                  router.push(
                                    `/Dashboard/payout/${row.original.id}`
                                  );
                                }}
                                className="cursor-pointer items-center"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                <span>Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {row.original.status === "PENDING" ? (
                                <>
                                  <DropdownMenuItem
                                    className="text-lime-600 cursor-pointer"
                                    onClick={() => setActiveDialog("confirm")}
                                  >
                                    <DialogTrigger className="w-full">
                                      <div className="flex items-center">
                                        <SquareCheckBig className="w-4 h-4 mr-2" />
                                        <span>Confirm</span>
                                      </div>
                                    </DialogTrigger>
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem
                                    className="text-red-500 cursor-pointer"
                                    onClick={() => setActiveDialog("decline")}
                                  >
                                    <DialogTrigger className="w-full">
                                      <div className="flex items-center">
                                        <SquareX className="w-4 h-4 mr-2" />
                                        <span>Decline</span>
                                      </div>
                                    </DialogTrigger>
                                  </DropdownMenuItem> */}
                                </>
                              ) : // row.original.status === "ONGOING" ? (
                              //   <DropdownMenuItem
                              //     onClick={() => {
                              //       router.push(
                              //         `/Dashboard/payout/${row.original.id}/proof`
                              //       );
                              //     }}
                              //     className="text-lime-600 cursor-pointer"
                              //   >
                              //     <div className="flex items-center">
                              //       <SquareCheckBig className="w-4 h-4 mr-2" />
                              //       <span>Send Proof</span>
                              //     </div>
                              //   </DropdownMenuItem>
                              // ) :

                              null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {activeDialog === "confirm" && (
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">
                                  Attention !
                                </DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to confirm payout?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button variant="lime">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="lime"
                                  onClick={() => {
                                    handleConfirmPayout(row.original.id);
                                  }}
                                >
                                  Confirm
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                          {activeDialog === "decline" && (
                            <DialogContent
                              className="sm:max-w-md"
                              accessKey="decline"
                            >
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">
                                  Attention !
                                </DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to decline transaction?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                  variant="lime"
                                  onClick={() => {
                                    handleDeclinePayout(row.original.id);
                                    setActiveDialog("");
                                  }}
                                >
                                  Decline
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
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

export default PayoutList;
