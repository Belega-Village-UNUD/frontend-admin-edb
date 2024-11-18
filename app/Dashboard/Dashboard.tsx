import CurrencyText from "@/components/CurrencyText";
import Loading from "@/components/Loading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { usePersistedAdmin } from "@/zustand/admins";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [token] = usePersistedAdmin((state) => [state.token]);

  useEffect(() => {
    if (!token) {
      // router.push("/");
    }
  }, [router, token]);

  const {
    isFetching,
    data: data,
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

  const {
    isFetching: isFetchingReport,
    data: report,
    isFetched: isFetchedReport,
    refetch: refetchReport,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/admin/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data.data;
    },
    queryKey: ["get-reports"],
    enabled: !!token,
  });

  if (isFetching || isFetchingReport) {
    return <Loading />;
  }

  const getTotalAmount = (data: any) => {
    return data.reduce((total: any, item: any) => {
      if (item.status === "SUCCESS") {
        return total + item.total_amount;
      }
      return total;
    }, 0);
  };

  const getSoldProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "SUCCESS") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const getCancelProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "CANCEL") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const getPendingProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "PENDING") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const totalAmount = report?.total_income || 0;
  const soldProductCount = getSoldProductCount(data || []);
  const cancelProductCount = getCancelProductCount(data || []);
  const pendingProductCount = getPendingProductCount(data || []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-6 md:gap-10 md:p-10">
        <div className="grid gap-6  md:gap-10 lg:grid-cols-2 ">
          <Card x-chunk="dashboard-01-chunk-0" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Transaction
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 overflow-hidden whitespace-nowrap text-ellipsis">
                <CurrencyText amount={totalAmount} />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-2 ">
            <Card x-chunk="dashboard-01-chunk-1" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">
                  Product Sold
                </CardTitle>
                <Users className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{soldProductCount}</div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">
                  Cancelled Transaction
                </CardTitle>
                <CreditCard className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-900">{cancelProductCount}</div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">
                  Pending Transaction
                </CardTitle>
                <Activity className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">{pendingProductCount}</div>
              </CardContent>
            </Card>
          </div>

        </div>
        <div className="grid gap-6 md:gap-10 grid-cols-4">
          <Card
            className="lg:col-span-2 col-span-1 h-fit shadow-lg hover:shadow-xl transition-shadow duration-300"
            x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-lg font-semibold text-green-800">Transactions</CardTitle>
                <CardDescription className="text-sm text-green-600">
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <div className="ml-auto gap-1 flex flex-row justify-center items-center">
                <Link href="/Dashboard/transaction" className="flex flex-row items-center gap-1 text-green-600 hover:text-green-800">
                  View All
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-green-700">Customer</TableHead>
                      <TableHead className="hidden xl:table-column text-green-700">
                        Type
                      </TableHead>
                      <TableHead className="hidden xl:table-column text-green-700">
                        Status
                      </TableHead>
                      <TableHead className="hidden xl:table-column text-green-700">
                        Date
                      </TableHead>
                      <TableHead className="text-right text-green-700">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data
                      ?.filter((sale: any) => sale.status !== null)
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .flatMap((sale: any, saleIndex: number) =>
                        sale.cart_details.map(
                          (detail: any, detailIndex: number) => (
                            <TableRow key={`${saleIndex}-${detailIndex}`}>
                              <TableCell>
                                <div
                                  className={`font-medium w-fit text-[11px] text-white rounded-2xl mb-1 py-1 px-2 ${sale.status === "PAYABLE"
                                    ? "bg-yellow-600"
                                    : sale.status === "PENDING"
                                      ? "bg-orange-600"
                                      : sale.status === "SUCCESS"
                                        ? "bg-green-600"
                                        : sale.status === "CANCEL"
                                          ? "bg-red-600"
                                          : "bg-gray-600"
                                    }`}
                                >
                                  {sale.status}
                                </div>
                                <div className="hidden text-sm text-black md:inline">
                                  {sale?.user?.email}
                                </div>
                              </TableCell>

                              <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                  {sale.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                {new Date(sale.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatRupiah(detail.unit_price * detail.qty)}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card
            x-chunk="dashboard-01-chunk-5"
            className="lg:col-span-2 col-span-1 h-fit shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">Recent Sales</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[650px]">
              <CardContent className="grid gap-8">
                {data
                  ?.filter((sale: any) => sale.status === "SUCCESS")
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .flatMap((sale: any) => sale.cart_details)
                  .map((detail: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={
                            detail?.product?.images[0] || "/placeholder-user.jpeg"
                          }
                          alt="Avatar"
                        />
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none text-purple-900">
                          {detail.product?.name_product}
                        </p>
                        <p className="text-xs text-purple-600">
                          {detail.product?.store?.name}
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-purple-900">
                        +{formatRupiah(detail.unit_price * detail.qty)}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
