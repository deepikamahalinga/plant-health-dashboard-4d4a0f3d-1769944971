import { Prisma } from '@prisma/client';

export type PlantDataCreateInput = {
  soilMoisture: number;
  locationId: string;
  timestamp: Date;
};

export type PlantDataUpdateInput = Partial<PlantDataCreateInput>;

export type PlantDataFilters = {
  locationId?: string;
  startDate?: Date;
  endDate?: Date;
};

export type PaginationParams = {
  skip?: number;
  take?: number;
};