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
import { useCategory } from '../../store-client/components/sheets/CartContext';

export function AllCategories() {
  const { categories, fetchCategories, deleteCategory } = useCategory();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Filter data by search
  const filteredData = useMemo(() => {
    return categories.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });
  }, [categories, searchQuery]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 25,
      },
      {
        id: 'image',
        accessorFn: (row) => row.image,
        header: ({ column }) => <DataGridColumnHeader title="Image" column={column} />,
        cell: ({ row }) => (
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-full h-full object-cover"
            />
          </div>
        ),
        enableSorting: false,
        size: 50,
      },
      {
        id: 'name',
        accessorFn: (row) => row.name,
        header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        enableSorting: true,
        size: 150,
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
        size: 40,
      },
      {
        id: 'actions',
        header: ({ column }) => <DataGridColumnHeader title="Actions" column={column} />,
        cell: ({ row }) => (
          <div className="flex justify-around gap-2 ">
            <Button size="sm" variant="outline">
              <Link to={`/store-admin/edit-category/${row.original._id}`}>Edit</Link>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteCategory(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
        enableSorting: false,
        size: 50,
      },
    ],
    [deleteCategory],
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
            <CardTitle>Categories</CardTitle>
          </CardHeading>
          <CardToolbar>
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search categories..."
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
              <Link to="/store-admin/add-category">Add Category</Link>
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
