import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

const prisma = new PrismaClient();

// Types
interface Location {
  id: string;
  name: string;
  // Add other location fields as needed
}

interface PlantData {
  id: string;
  timestamp: Date;
  soilMoisture: number;
  locationId: string;
}

// Sample data generators
const generateLocations = (count: number): Location[] => {
  const locations: Location[] = [];
  const locationNames = [
    'Greenhouse A',
    'Garden Plot B',
    'Indoor Lab C',
    'Field Station D',
    'Research Zone E',
  ];

  for (let i = 0; i < count; i++) {
    locations.push({
      id: uuidv4(),
      name: locationNames[i % locationNames.length],
    });
  }
  return locations;
};

const generatePlantData = (locations: Location[], count: number): PlantData[] => {
  const plantData: PlantData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // Generate timestamp within last 30 days
    const timestamp = new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    );

    plantData.push({
      id: uuidv4(),
      timestamp,
      soilMoisture: Number((30 + Math.random() * 40).toFixed(2)), // Random between 30-70%
      locationId: locations[Math.floor(Math.random() * locations.length)].id,
    });
  }
  return plantData;
};

// Main seed function
async function seed() {
  try {
    console.log(chalk.blue('🌱 Starting database seed...'));

    // Clear existing data (optional)
    console.log(chalk.yellow('Clearing existing data...'));
    await prisma.plantData.deleteMany({});
    await prisma.location.deleteMany({});

    // Create locations
    console.log(chalk.green('Creating locations...'));
    const locations = generateLocations(5);
    await prisma.location.createMany({
      data: locations,
    });

    // Create plant data
    console.log(chalk.green('Creating plant data...'));
    const plantData = generatePlantData(locations, 10);
    await prisma.plantData.createMany({
      data: plantData,
    });

    console.log(chalk.green('✅ Seed completed successfully'));
  } catch (error) {
    console.error(chalk.red('Error during seed:'), error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export for external usage
export default seed;

// Allow running directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log(chalk.blue('Seed script completed'));
      process.exit(0);
    })
    .catch((error) => {
      console.error(chalk.red('Seed script failed:'), error);
      process.exit(1);
    });
}