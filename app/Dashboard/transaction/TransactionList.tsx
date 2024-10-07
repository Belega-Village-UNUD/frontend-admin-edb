"use client";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import CurrencyText from "@/components/CurrencyText";
import Loading from "@/components/Loading";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useQuery } from "@tanstack/react-query";
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
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Copy,
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

type Transaction = {
  id: string;
  transactionId: string;
  createdAt: string;
  total_amount: number;
  status: "PENDING" | "PAYABLE" | "SUCCESS" | "CANCEL";
  user: {
    email: string;
  };
  transaction: {
    status: string;
    total_amount: number;
  };
};

const columns: ColumnDef<Transaction>[] = [
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
    id: "transactionId",
    enableHiding: false,
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="flex gap-[2px]">
        {row.original.id}
        <Copy
          className="w-2 h-2 opacity-50 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(row.original.id);
            toast.success("Copied to clipboard!");
          }}
        />
      </div>
    ),
  },
  {
    id: "Order Date",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
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
    cell: ({ row }) => {
      const status = row.original.status;
      const arrivalShippingStatus =
        // @ts-ignore
        row?.original?.cart_details[0]?.arrival_shipping_status;

      return (
        <div className="capitalize opacity-70">
          {status !== "SUCCESS" ? (
            <p>{status}</p>
          ) : (
            <p>{arrivalShippingStatus || "No status available"}</p>
          )}
        </div>
      );
    },
  },
  {
    id: "customer",
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.original.user.email}</div>
    ),
  },
  {
    id: "Total Amount",
    accessorKey: "total_amount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original?.total_amount?.toString());

      return (
        <div className="text-right font-medium">
          <CurrencyText amount={amount} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
  },
];

const TransactionList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [newEmail, setNewEmail] = useState("");
  const [activeDialog, setActiveDialog] = useState("");
  const router = useRouter();

  const [token] = usePersistedAdmin((state) => [state.token]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please Login First");
      return null;
    }
    return token;
  }, [token]);

  const {
    isFetching,
    data: transactions,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-admin-list-transactions", token],
    enabled: !!token,
  });

  const handleConfirmTransaction = useCallback(
    async (id: string) => {
      try {
        const token = getToken();
        if (!token) {
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transaction/confirm/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        // console.log(responseJson)
        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          setActiveDialog("");
        } else {
          toast.error(responseJson.message);
          setActiveDialog("");
        }
      } catch (error: any) {
        // console.log(error.message)
      }
    },
    [getToken]
  );

  const handleDeclineTransaction = useCallback(
    async (id: string) => {
      try {
        const token = getToken();
        if (!token) {
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/transaction/decline/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        // // console.log(responseJson)
        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          setActiveDialog("");
        } else {
          toast.error(responseJson.message);
          setActiveDialog("");
        }
      } catch (error: any) {
        // console.log(error.message)
      }
    },
    [getToken]
  );

  const table = useReactTable({
    data: transactions || [],
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

  if (!token) {
    return <Loading />;
  }

  if (isFetching) {
    return <Loading />;
  }

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
                Store Transaction
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:px-8 lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Store Transaction
          </h1>
          <p className="text-sm text-gray-500">List your Transaction Store</p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative">
          <Search className="absolute top-3 left-0 ml-2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Filter transaction id..."
            value={
              (table.getColumn("transactionId")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("transactionId")
                ?.setFilterValue(event.target.value)
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
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
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
                                    `/Dashboard/transaction/${row.original.id}`
                                  );
                                }}
                                className="cursor-pointer items-center"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                <span>Detail</span>
                              </DropdownMenuItem>
                              {/* <DropdownMenuSeparator />
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
                              <DropdownMenuItem
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
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {activeDialog === "confirm" && (
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">
                                  Attention !
                                </DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to confirm transaction?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <ButtonConfirm label="Cancel" outline />
                                </DialogClose>
                                <ButtonConfirm
                                  label="Confirm"
                                  onClick={() => {
                                    handleConfirmTransaction(row.original.id);
                                  }}
                                />
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
                                  <ButtonConfirm label="Cancel" outline />
                                </DialogClose>
                                <ButtonConfirm
                                  label="Decline"
                                  onClick={() =>
                                    handleDeclineTransaction(row.original.id)
                                  }
                                />
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

export default TransactionList;
