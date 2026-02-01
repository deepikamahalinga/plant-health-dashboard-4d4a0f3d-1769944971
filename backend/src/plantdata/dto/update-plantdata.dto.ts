import { z } from 'zod';

export const UpdatePlantDataDto = z.object({
  timestamp: z
    .string()
    .datetime({ message: 'Invalid timestamp format' })
    .optional(),

  soilMoisture: z
    .number()
    .min(0, { message: 'Soil moisture must be at least 0%' })
    .max(100, { message: 'Soil moisture cannot exceed 100%' })
    .optional(),

  locationId: z
    .string()
    .uuid({ message: 'Location ID must be a valid UUID' })
    .optional(),
}).strict();

export type UpdatePlantDataDto = z.infer<typeof UpdatePlantDataDto>;