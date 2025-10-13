'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
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
import { useProduct } from '../../../store-client/components/sheets/CartContext';


export function ProductList() {
  const { products, fetchProducts, deleteProduct } = useProduct();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [searchQuery, setSearchQuery] = useState('');
  //console.log(products)

  // ✅ Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Filter data by search
  const filteredData = useMemo(() => {
    return products.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        item.serviceName.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        String(item.price).toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

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
        id: 'image',
        accessorFn: (row) => row.imageUrl || row.imageUrl,
        header: ({ column }) => <DataGridColumnHeader title="Image" column={column} />,
        cell: ({ row }) => <div className="w-16 h-16 rounded-full overflow-hidden"> <img src={row.original.imageUrl || row.original.imageUrl} alt={row.original.serviceName} className=' h-full w-full' /></div>,
        enableSorting: true,
        size: 80,
      },
      {
        id: 'name',
        accessorFn: (row) => row.serviceName || row.name,
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => <span className="font-medium">{row.original.serviceName || row.original.name}</span>,
        enableSorting: true,
        size: 200,
      },
      {
        id: 'category',
        accessorFn: (row) => row.category?.name || row.category,
        header: ({ column }) => <DataGridColumnHeader title="Category" column={column} />,
        cell: ({ row }) => <span>{row.original.category?.name || row.original.category}</span>,
        enableSorting: true,
        size: 150,
      },
      {
        id: 'price',
        accessorFn: (row) => row.price,
        header: ({ column }) => <DataGridColumnHeader title="Price" column={column} />,
        cell: ({ row }) => <span>${row.original.price}</span>,
        enableSorting: true,
        size: 100,
      },
      {
        id: 'duration',
        accessorFn: (row) => row.duration,
        header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
        cell: ({ row }) => <span>{row.original.duration} min</span>,
        enableSorting: true,
        size: 120,
      },
      {
        id: 'status',
        accessorFn: (row) => row.active,
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ row }) => (
          <Badge
            size="sm"
            variant={row.original.active ? 'success' : 'destructive'}
            appearance="light"
          >
            {row.original.active ? 'Active' : 'Inactive'}
          </Badge>
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        cell: ({ row }) => (
          <div className="flex justify-between gap-2">
            <Button size="sm" variant="outline">
              <Link to={`/store-admin/edit-product/${row.original._id}`}>Edit</Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteProduct(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
        enableSorting: false,
        size: 150,
      },
    ],
    [deleteProduct],
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
    <DataGrid className="px-2"
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: false,
        cellBorder: true,
      }}
    >
      <Card className=" w-full  ">
        <CardHeader className="py-5 flex-wrap gap-2">
          <CardHeading>
            <CardTitle>Products</CardTitle>
          </CardHeading>
          <CardToolbar>
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search products..."
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
            <Button variant="outline">
              <Link to="/store-admin/add-product">Add Product</Link>
            </Button>
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
