'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Calendar as CalendarIcon, Search, Smartphone, X } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { API_BASE_URL } from '../../../config/endpoin.config';
import { apiFetch } from '../../store-client/components/utils/ApiFetch';
import { toast } from 'sonner';

export function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // ✅ Fetch payments from API
  const fetchPayments = async ({ range, from, to } = {}) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/payment`;
      const params = new URLSearchParams();

      if (range) params.append('range', range);
      if (from && to) {
        params.append('from', from.toISOString().split('T')[0]);
        params.append('to', to.toISOString().split('T')[0]);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await apiFetch(url);
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);  

  // ✅ Filter data (search on customerName, phone, amount, id)
  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        item.customer?.name?.toLowerCase().includes(searchLower) ||
        item.customer?.phone?.toLowerCase().includes(searchLower) ||
        item.finalAmount?.toString().toLowerCase().includes(searchLower) ||
        item._id?.toLowerCase().includes(searchLower)
      );
    });
  }, [payments, searchQuery]);

  // ✅ Columns (same as before, unchanged)
  const columns = useMemo(
    () => [
      {
        accessorKey: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 50,
      },
      {
        id: 'id',
        accessorFn: (row) => row._id,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payment ID" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-mono text-ellipsis line-clamp-1">
            #{row.original._id}
          </span>
        ),
        enableSorting: true,
        size: 200,
      },
      {
        id: 'service-name',
        accessorFn: (row) => row._id,
        header: ({ column }) => (
          <DataGridColumnHeader title="Service Name" column={column} />
        ),
        cell: ({ row }) =>
          row.original.items.map((service) => (
            <span key={service._id} className="font-medium text-mono block">
              {service.serviceId.serviceName}
            </span>
          )),
        enableSorting: true,
        size: 200,
      },
      {
        id: 'customer',
        accessorFn: (row) => row.customer.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Customer Name&Phone" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-mono font-medium">
            {row?.original?.customer?.name} <br />
            <small className="text-neutral-500 inline-flex items-center">
              <Smartphone size={14} />- {row?.original?.customer?.phone}
            </small>
          </span>
        ),
        enableSorting: true,
        size: 200,
      },
      {
        id: 'amount',
        accessorFn: (row) => row.items[0].price,
        header: ({ column }) => (
          <DataGridColumnHeader title=" Amount" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-mono">₹{row.original.total}</span>
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: 'discount',
        accessorFn: (row) => row.discount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Discount" column={column} />
        ),
        cell: ({ row }) => (
          <span>
            {row.original.discount} {row.original.discountType}
          </span>
        ),
        enableSorting: true,
        size: 100,
      },
      {
        id: 'final-amount',
        accessorFn: (row) => row.finalAmount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Final Amount" column={column} />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-mono">
            ₹{Math.round(row.original.finalAmount)}
          </span>
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: 'paymentMode',
        accessorFn: (row) => row.paymentMode,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payment Mode" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">
            {row.original.paymentMode}
          </span>
        ),
        enableSorting: true,
        size: 130,
      },
      {
        id: 'createdAt',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
        enableSorting: true,
        size: 150,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button mode="link" underlined="dashed">
            <Link to={`/store-admin/invoice/${row.original._id}`}>Details</Link>
          </Button>
        ),
        enableSorting: false,
        size: 80,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row) => row._id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /// export functionalities
  const exportToCSV = ()=>{
    if(!filteredData.length){
      toast.error('no data to be export')
      return
    }

      // Define headers
  const headers = [
    "Payment ID",
    "Service Names",
    "Customer Name",
    "Customer Phone",
    "Amount",
    "Discount",
    "Final Amount",
    "Payment Mode",
    "Date",
  ];

  // Convert rows
  const rows = filteredData.map((row) => [
    row._id,
    row.items.map((s) => s.serviceId?.serviceName).join(", "),
    row.customer?.name,
    row.customer?.phone,
    row.total,
    `${row.discount} ${row.discountType}`,
    Math.round(row.finalAmount),
    row.paymentMode,
    new Date(row.createdAt).toLocaleDateString(),
  ]);

  // Combine into CSV string
  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            `"${(cell ?? "").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

  // Create Blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `payments_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  }


  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: false,
        cellBorder: true,
      }}
    >
      <Card className="min-w-full">
        <CardHeader className="py-5 flex-wrap gap-2">
          <CardHeading className='w-full flex justify-between items-center gap-5'>
            <CardTitle>All Payments</CardTitle>
             <Button variant="outline" onClick={exportToCSV}>
              Export CSV
            </Button>
          </CardHeading>
          <CardToolbar className=" w-full flex justify-between gap-2">
            {/* 🔍 Search */}
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by ID, name or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 w-56"
              />
              {searchQuery.length > 0 && (
                <Button
                  mode="icon"
                  variant="ghost"
                  className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery('')}
                >
                  <X />
                </Button>
              )}
            </div>

                 {/* filter  */}
                 <div className=' flex gap-2'>
            {/* 📅 Quick Filters */}
            <Button
              variant="outline"
              onClick={() => fetchPayments({ range: '1m' })}
            >
              1M
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchPayments({ range: '2m' })}
            >
              2M
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchPayments({ range: '3m' })}
            >
              3M
            </Button>
            <Button variant="ghost" onClick={() => fetchPayments()}>
              Reset
            </Button>

            {/* 📅 Custom Date Range */}
            {/* 📅 From Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  {dateRange.from
                    ? dateRange.from.toLocaleDateString()
                    : 'From Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => {
                    setDateRange((prev) => ({ ...prev, from: date }));
                    if (date && dateRange.to) {
                      fetchPayments({ from: date, to: dateRange.to });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* 📅 To Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon size={16} />
                  {dateRange.to ? dateRange.to.toLocaleDateString() : 'To Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => {
                    setDateRange((prev) => ({ ...prev, to: date }));
                    if (date && dateRange.from) {
                      fetchPayments({ from: dateRange.from, to: date });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

                 </div>

           
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            {loading ? (
              <div className="p-4 text-center">Loading payments...</div>
            ) : (
              <DataGridTable />
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
