import { 
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlantDataService } from './plant-data.service';
import { CreatePlantDataDto } from './dto/create-plant-data.dto';
import { UpdatePlantDataDto } from './dto/update-plant-data.dto';
import { PlantDataFilterDto } from './dto/plant-data-filter.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('plant-data')
@Controller('plant-data')
@UseGuards(JwtAuthGuard)
export class PlantDataController {
  constructor(private readonly plantDataService: PlantDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all plant data measurements with filtering and pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved plant data' })
  async getAllPlantDatas(@Query() filterDto: PlantDataFilterDto) {
    return await this.plantDataService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plant data measurement by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved plant data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plant data not found' })
  async getPlantDataById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.plantDataService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new plant data measurement' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Successfully created plant data' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async createPlantData(@Body() createPlantDataDto: CreatePlantDataDto) {
    return await this.plantDataService.create(createPlantDataDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update plant data measurement' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully updated plant data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plant data not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async updatePlantData(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlantDataDto: UpdatePlantDataDto,
  ) {
    return await this.plantDataService.update(id, updatePlantDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plant data measurement' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Successfully deleted plant data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plant data not found' })
  async deletePlantData(@Param('id', ParseUUIDPipe) id: string) {
    await this.plantDataService.delete(id);
    return { statusCode: HttpStatus.NO_CONTENT };
  }

  @Get('location/:locationId/latest')
  @ApiOperation({ summary: 'Get latest readings by location' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved latest plant data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Location not found' })
  async getLatestByLocation(@Param('locationId', ParseUUIDPipe) locationId: string) {
    return await this.plantDataService.findLatestByLocation(locationId);
  }

  @Get('location/:locationId/range')
  @ApiOperation({ summary: 'Get readings by date range for a location' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved plant data range' })
  async getByDateRange(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.plantDataService.findByDateRange(locationId, startDate, endDate);
  }
}