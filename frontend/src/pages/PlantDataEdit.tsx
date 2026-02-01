import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PlantData, Location } from '../types';
import { getPlantData, updatePlantData } from '../api';
import { Alert } from '../components/Alert';
import { Spinner } from '../components/Spinner';

// Validation schema
const plantDataSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime().refine(val => new Date(val) <= new Date(), {
    message: "Timestamp cannot be in the future"
  }),
  soilMoisture: z.number().min(0).max(100),
  locationId: z.string().uuid()
});

type FormData = z.infer<typeof plantDataSchema>;

export const PlantDataEdit: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    id: '',
    timestamp: '',
    soilMoisture: 0,
    locationId: ''
  });
  
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const data = await getPlantData(id);
        if (!data) {
          throw new Error('Plant data not found');
        }
        const formattedData = {
          ...data,
          timestamp: new Date(data.timestamp).toISOString().slice(0, 16)
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plant data');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    try {
      // Validate form data
      const validated = plantDataSchema.parse(formData);
      
      setLoading(true);
      await updatePlantData(validated);
      navigate(`/plant-data/${id}`);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: {[key: string]: string} = {};
        err.errors.forEach(error => {
          if (error.path) {
            errors[error.path[0]] = error.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update plant data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setValidationErrors({});
  };

  if (fetchLoading) {
    return <div className="flex justify-center p-8"><Spinner /></div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Plant Data</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timestamp
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </label>
          {validationErrors.timestamp && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.timestamp}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Soil Moisture (%)
            <input
              type="number"
              name="soilMoisture"
              value={formData.soilMoisture}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </label>
          {validationErrors.soilMoisture && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.soilMoisture}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location ID
            <input
              type="text"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </label>
          {validationErrors.locationId && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.locationId}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};