'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function CustomerTable({ customers, title }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Search filter
  const filteredData = useMemo(() => {
    return customers.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        item.name?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.country?.toLowerCase().includes(q) ||
        item.state?.toLowerCase().includes(q) ||
        item.city?.toLowerCase().includes(q) ||
        item.street?.toLowerCase().includes(q) ||
        item.postCode?.toString().toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);
//console.log(customers)
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 50,
      },
      {
        id: 'name',
        accessorFn: (row) => row.name,
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        enableSorting: true,
        size: 200,
      },
      {
        id: 'phone',
        accessorFn: (row) => row.phone,
        header: ({ column }) => <DataGridColumnHeader title="Phone" column={column} />,
        cell: ({ row }) => <span>{row.original.phone}</span>,
        size: 150,
      },
      {
        id: 'email',
        accessorFn: (row) => row.email,
        header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
        cell: ({ row }) => <span>{row.original.email}</span>,
        size: 200,
      },
      {
        id: 'visit',
        accessorFn: (row) => row.totalVisits,
        header: ({ column }) => <DataGridColumnHeader title="No. of Visit" column={column} />,
        cell: ({ row }) => <span>{row.original.totalVisits}</span>,
        size: 120,
      },
      {
        id: 'lastVisit',
        accessorFn: (row) => row.lastVisit,
        header: ({ column }) => <DataGridColumnHeader title="Last Visit" column={column} />,
        cell: ({ row }) => <span>{ new Date(row.original.lastVisit).toLocaleDateString()}</span>,
        size: 130,
      },
      {
        id: 'country',
        accessorFn: (row) => row.country,
        header: ({ column }) => <DataGridColumnHeader title="Country" column={column} />,
        cell: ({ row }) => <span>{row.original.country}</span>,
        size: 150,
      },
      {
        id: 'state',
        accessorFn: (row) => row.state,
        header: ({ column }) => <DataGridColumnHeader title="State" column={column} />,
        cell: ({ row }) => <span>{row.original.state}</span>,
        size: 150,
      },
      {
        id: 'city',
        accessorFn: (row) => row.city,
        header: ({ column }) => <DataGridColumnHeader title="City" column={column} />,
        cell: ({ row }) => <span>{row.original.city}</span>,
        size: 150,
      },
      {
        id: 'street',
        accessorFn: (row) => row.street,
        header: ({ column }) => <DataGridColumnHeader title="Street" column={column} />,
        cell: ({ row }) => <span>{row.original.street}</span>,
        size: 200,
      },
      {
        id: 'postCode',
        accessorFn: (row) => row.postCode,
        header: ({ column }) => <DataGridColumnHeader title="Postal Code" column={column} />,
        cell: ({ row }) => <span>{row.original.postCode}</span>,
        size: 120,
      },
    ],
    []
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

  return (
    <DataGrid
      className="px-2"
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: false,
        cellBorder: true,
      }}
    >
      <Card className="w-full">
        <CardHeader className="py-5 flex-wrap gap-2">
          <CardHeading>
            <CardTitle>{title}</CardTitle>
          </CardHeading>
          <CardToolbar>
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 w-40"
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
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
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
