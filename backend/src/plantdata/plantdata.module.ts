// plant-data.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantDataController } from './plant-data.controller';
import { PlantDataService } from './plant-data.service';
import { PlantData } from './entities/plant-data.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantData]),
    LocationModule, // Import LocationModule for relationship
  ],
  controllers: [PlantDataController],
  providers: [
    PlantDataService,
  ],
  exports: [PlantDataService], // Export service for use in other modules
})
export class PlantDataModule {}