import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Card,
  Title,
  Badge,
  Button,
  TextInput,
  Select,
  SelectItem,
} from '@tremor/react';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Types
interface PlantData {
  id: string;
  timestamp: string;
  soilMoisture: number;
  locationId: string;
  location?: {
    name: string;
  };
}

interface PlantDataListProps {
  initialData?: PlantData[];
}

const PAGE_SIZES = [10, 25, 50, 100];

export default function PlantDataList({ initialData }: PlantDataListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortField, setSortField] = useState<keyof PlantData>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch data
  const { data, isLoading, isError, error, refetch } = useQuery<{
    data: PlantData[];
    total: number;
  }>(['plantData', page, pageSize, search, sortField, sortDirection], {
    initialData: initialData ? { data: initialData, total: initialData.length } : undefined,
  });

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      // API call to delete
      await fetch(`/api/plant-data/${id}`, { method: 'DELETE' });
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="mt-6">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-semibold">Error loading data</h3>
          <p className="mt-1 text-gray-500">{(error as Error)?.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Title>Plant Data</Title>
          <Button onClick={() => router.push('/plant-data/new')}>
            Add New Measurement
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            icon={MagnifyingGlassIcon}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </Select>
        </div>

        <Card>
          {data?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No plant data found</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell 
                    onClick={() => setSortField('timestamp')}
                    className="cursor-pointer"
                  >
                    Timestamp
                  </TableHeaderCell>
                  <TableHeaderCell 
                    onClick={() => setSortField('soilMoisture')}
                    className="cursor-pointer"
                  >
                    Soil Moisture
                  </TableHeaderCell>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(new Date(item.timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell>
                      <Badge color={item.soilMoisture < 30 ? 'red' : 'green'}>
                        {item.soilMoisture}%
                      </Badge>
                    </TableCell>
                    <TableCell>{item.location?.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => router.push(`/plant-data/${item.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => router.push(`/plant-data/${item.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="secondary"
                          color="red"
                          onClick={() => setDeleteId(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-gray-500">
            Total: {data?.total || 0} items
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={!data?.data.length || data.data.length < pageSize}
              onClick={() => setPage(page + 1)}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm">
            <Dialog.Title className="text-lg font-medium">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description className="mt-2">
              Are you sure you want to delete this measurement?
            </Dialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => deleteId && handleDelete(deleteId)}
              >
                Delete
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}