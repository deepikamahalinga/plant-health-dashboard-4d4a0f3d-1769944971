// plantdata.api.ts
import axios, { AxiosError, AxiosInstance } from 'axios';

// Types
export interface PlantData {
  id: string;
  timestamp: string;
  soilMoisture: number;
  locationId: string;
}

export interface PlantDataCreate extends Omit<PlantData, 'id'> {}
export interface PlantDataUpdate extends Partial<PlantDataCreate> {}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  locationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SortParams {
  field: keyof PlantData;
  direction: 'asc' | 'desc';
}

export interface PlantDataResponse {
  data: PlantData[];
  total: number;
  page: number;
  limit: number;
}

export class PlantDataApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public originalError: AxiosError
  ) {
    super(message);
    this.name = 'PlantDataApiError';
  }
}

// API Client
export class PlantDataApi {
  private client: AxiosInstance;
  private static RETRY_ATTEMPTS = 3;
  private static RETRY_DELAY = 1000;

  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL;
    
    this.client = axios.create({
      baseURL: `${baseURL}/api`,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest._retry && originalRequest._retryCount < PlantDataApi.RETRY_ATTEMPTS) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          await new Promise(resolve => 
            setTimeout(resolve, PlantDataApi.RETRY_DELAY * originalRequest._retryCount)
          );

          return this.client(originalRequest);
        }

        throw new PlantDataApiError(
          error.response?.status || 500,
          error.response?.data?.message || 'An error occurred',
          error
        );
      }
    );
  }

  async getAllPlantDatas(
    filters?: FilterParams,
    pagination?: PaginationParams,
    sort?: SortParams
  ): Promise<PlantDataResponse> {
    try {
      const { data } = await this.client.get('/plantdatas', {
        params: {
          ...filters,
          ...pagination,
          ...sort,
        },
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPlantDataById(id: string): Promise<PlantData> {
    try {
      const { data } = await this.client.get(`/plantdatas/${id}`);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPlantData(plantData: PlantDataCreate): Promise<PlantData> {
    try {
      const { data } = await this.client.post('/plantdatas', plantData);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePlantData(id: string, plantData: PlantDataUpdate): Promise<PlantData> {
    try {
      const { data } = await this.client.put(`/plantdatas/${id}`, plantData);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePlantData(id: string): Promise<void> {
    try {
      await this.client.delete(`/plantdatas/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof PlantDataApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw new PlantDataApiError(
        error.response?.status || 500,
        error.response?.data?.message || 'An error occurred',
        error
      );
    }

    throw new PlantDataApiError(500, 'An unexpected error occurred', error);
  }
}

// Export singleton instance
export const plantDataApi = new PlantDataApi();