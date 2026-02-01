import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Types (would be imported from types file)
interface PlantData {
  id: string;
  timestamp: string;
  soilMoisture: number;
  locationId: string;
}

interface Location {
  id: string;
  name: string;
}

// Validation schema
const plantDataSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime().refine(val => new Date(val) <= new Date(), {
    message: "Timestamp cannot be in the future"
  }),
  soilMoisture: z.number().min(0).max(100),
  locationId: z.string().uuid()
});

const PlantDataCreate: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PlantData>({
    id: uuidv4(),
    timestamp: new Date().toISOString().slice(0, 16), // Format for datetime-local
    soilMoisture: 0,
    locationId: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PlantData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]); // Would be populated from API

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soilMoisture' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data
      plantDataSchema.parse(formData);
      
      setIsSubmitting(true);
      
      // API call would go here
      // await createPlantData(formData);
      
      navigate('/plant-data'); // Redirect to list view
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof PlantData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PlantData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add Plant Data Measurement</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700">
              Measurement Time
            </label>
            <input
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              max={new Date().toISOString().slice(0, 16)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
            {errors.timestamp && (
              <p className="mt-1 text-sm text-red-600">{errors.timestamp}</p>
            )}
          </div>

          <div>
            <label htmlFor="soilMoisture" className="block text-sm font-medium text-gray-700">
              Soil Moisture (%)
            </label>
            <input
              type="number"
              id="soilMoisture"
              name="soilMoisture"
              value={formData.soilMoisture}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
            {errors.soilMoisture && (
              <p className="mt-1 text-sm text-red-600">{errors.soilMoisture}</p>
            )}
          </div>

          <div>
            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select a location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/plant-data')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantDataCreate;