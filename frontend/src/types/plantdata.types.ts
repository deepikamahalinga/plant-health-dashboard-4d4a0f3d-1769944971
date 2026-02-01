// plantdata.types.ts

import { z } from 'zod';

/**
 * Represents a single plant health measurement
 * @interface PlantData
 */
export interface PlantData {
  /** Unique identifier for the measurement */
  id: string;
  
  /** When the measurement was taken */
  timestamp: Date;
  
  /** Soil moisture percentage (0-100) */
  soilMoisture: number;
  
  /** Reference to measurement location */
  locationId: string;
  
  /** Associated location details */
  location?: Location;
  
  /** Record creation timestamp */
  createdAt: Date;
  
  /** Record last update timestamp */
  updatedAt: Date;
}

/**
 * Location reference type
 */
export interface Location {
  id: string;
  name: string;
}

/**
 * Data required to create a new plant measurement
 * @type CreatePlantDataDto
 */
export type CreatePlantDataDto = Omit<PlantData, 'id' | 'createdAt' | 'updatedAt' | 'location'>;

/**
 * Data required to update an existing plant measurement
 * @type UpdatePlantDataDto
 */
export type UpdatePlantDataDto = Partial<CreatePlantDataDto>;

/**
 * Valid sort fields for plant data
 */
export enum PlantDataSortField {
  TIMESTAMP = 'timestamp',
  SOIL_MOISTURE = 'soilMoisture',
  LOCATION_ID = 'locationId'
}

/**
 * Sort direction options
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Filter parameters for querying plant data
 * @interface PlantDataFilterParams
 */
export interface PlantDataFilterParams {
  /** Filter by location ID */
  locationId?: string;
  
  /** Filter by start date */
  startDate?: Date;
  
  /** Filter by end date */
  endDate?: Date;
  
  /** Filter by minimum soil moisture */
  minSoilMoisture?: number;
  
  /** Filter by maximum soil moisture */ 
  maxSoilMoisture?: number;
}

/**
 * Pagination parameters
 * @interface PaginationParams
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page: number;
  
  /** Items per page */
  limit: number;
}

/**
 * Sort parameters
 * @interface SortParams
 */
export interface SortParams {
  /** Field to sort by */
  field: PlantDataSortField;
  
  /** Sort direction */
  direction: SortDirection;
}

/**
 * API response wrapper with metadata
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  
  /** Response metadata */
  metadata: {
    /** Total number of items */
    total: number;
    
    /** Current page number */
    page: number;
    
    /** Items per page */
    limit: number;
    
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Zod validation schema for plant data
 */
export const plantDataSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date().max(new Date(), 'Timestamp cannot be in the future'),
  soilMoisture: z.number().min(0).max(100),
  locationId: z.string().uuid(),
});

/**
 * Zod validation schema for create DTO
 */
export const createPlantDataSchema = plantDataSchema.omit({ 
  id: true 
});

/**
 * Zod validation schema for update DTO
 */
export const updatePlantDataSchema = createPlantDataSchema.partial();

/**
 * Type alias for paginated plant data response
 */
export type PaginatedPlantDataResponse = ApiResponse<PlantData[]>;

/**
 * Utility type for plant data list query parameters
 */
export type PlantDataQueryParams = PlantDataFilterParams & PaginationParams & SortParams;