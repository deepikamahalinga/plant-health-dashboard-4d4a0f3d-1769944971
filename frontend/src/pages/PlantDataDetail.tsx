import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, Title, Text, Button, Badge, Flex, Breadcrumbs } from '@tremor/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { PlantData, Location } from '../types';
import { getPlantData, getLocation, deletePlantData } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmModal from '../components/ConfirmModal';

const PlantDataDetail: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) throw new Error('No ID provided');
      
      const data = await getPlantData(id);
      if (!data) {
        throw new Error('Plant data not found');
      }
      
      setPlantData(data);
      
      // Load related location data
      const locationData = await getLocation(data.locationId);
      setLocation(locationData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;
      await deletePlantData(id);
      navigate('/plant-data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (!plantData) {
    return (
      <div className="p-4">
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The plant data record you're looking for doesn't exist.</p>
          <div className="mt-6">
            <Link
              to="/plant-data"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Breadcrumbs>
        <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        <Link to="/plant-data" className="text-gray-500 hover:text-gray-700">Plant Data</Link>
        <span className="text-gray-900">View Details</span>
      </Breadcrumbs>

      <Card className="mt-6">
        <Flex justifyContent="between" alignItems="center">
          <Title>Plant Data Details</Title>
          <Flex className="space-x-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/plant-data')}
            >
              Back to List
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/plant-data/edit/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              color="red"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </Flex>
        </Flex>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Text className="font-medium">ID</Text>
            <Text className="mt-1">{plantData.id}</Text>
          </div>

          <div>
            <Text className="font-medium">Timestamp</Text>
            <Text className="mt-1">
              {format(new Date(plantData.timestamp), 'PPpp')}
            </Text>
          </div>

          <div>
            <Text className="font-medium">Soil Moisture</Text>
            <Text className="mt-1">
              {plantData.soilMoisture.toFixed(2)}%
            </Text>
          </div>

          <div>
            <Text className="font-medium">Location</Text>
            <div className="mt-1">
              {location ? (
                <Link 
                  to={`/locations/${location.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {location.name}
                </Link>
              ) : (
                <Badge color="red">Location Not Found</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Plant Data"
        message="Are you sure you want to delete this plant data record? This action cannot be undone."
      />
    </div>
  );
};

export default PlantDataDetail;