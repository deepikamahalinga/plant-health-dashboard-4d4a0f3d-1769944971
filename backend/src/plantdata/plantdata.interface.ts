/**
 * Represents core plant health measurement data
 * @interface PlantData
 */
export interface PlantData {
  /**
   * Unique identifier for the measurement
   * @format uuid
   */
  id: string;

  /**
   * When the measurement was taken
   * @format date-time
   */
  timestamp: Date;

  /**
   * Soil moisture percentage
   * @minimum 0
   * @maximum 100
   */
  soilMoisture: number;

  /**
   * Reference to measurement location
   * @format uuid
   */
  locationId: string;
}

/**
 * Represents data needed to create a new plant measurement
 * @interface CreatePlantData
 */
export type CreatePlantData = Omit<PlantData, 'id'>;

/**
 * Represents data that can be updated for a plant measurement
 * @interface UpdatePlantData
 */
export type UpdatePlantData = Partial<Omit<PlantData, 'id' | 'locationId'>>;

/**
 * Represents the relationship between PlantData and Location
 * @interface PlantDataWithLocation
 */
export interface PlantDataWithLocation extends PlantData {
  /**
   * The associated location details
   */
  location: {
    id: string;
    // Add other location fields as needed
  };
}

/**
 * Represents query parameters for filtering plant data
 * @interface PlantDataFilters
 */
export interface PlantDataFilters {
  /**
   * Start date for filtering measurements
   * @format date-time
   */
  startDate?: Date;

  /**
   * End date for filtering measurements
   * @format date-time 
   */
  endDate?: Date;

  /**
   * Location ID to filter measurements
   * @format uuid
   */
  locationId?: string;
}