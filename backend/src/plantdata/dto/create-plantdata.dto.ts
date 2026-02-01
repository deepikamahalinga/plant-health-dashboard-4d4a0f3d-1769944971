import { z } from 'zod';

/**
 * DTO Schema for creating new plant measurement data
 */
export const CreatePlantDataDtoSchema = z.object({
  /**
   * Timestamp when measurement was taken
   */
  timestamp: z.string()
    .datetime({ message: 'Invalid timestamp format' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Timestamp must be a valid date'
    }),

  /**
   * Soil moisture percentage measurement
   */
  soilMoisture: z.number()
    .min(0, { message: 'Soil moisture cannot be negative' })
    .max(100, { message: 'Soil moisture cannot exceed 100%' })
    .finite()
    .refine((val) => !isNaN(val), {
      message: 'Soil moisture must be a valid number'
    }),

  /**
   * UUID reference to measurement location
   */
  locationId: z.string()
    .uuid({ message: 'Location ID must be a valid UUID v4' })
});

/**
 * Type definition for plant measurement creation DTO
 */
export type CreatePlantDataDto = z.infer<typeof CreatePlantDataDtoSchema>;

/**
 * Example usage:
 * const plantData: CreatePlantDataDto = {
 *   timestamp: '2023-12-25T10:00:00Z',
 *   soilMoisture: 75.5,
 *   locationId: '123e4567-e89b-12d3-a456-426614174000'
 * };
 */