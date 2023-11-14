import { AxiosInstance } from 'axios';

// Interfaces for general response of all apis

export interface IGetListParams {
    limit?: number;
    page?: number;
}

export interface IServiceOption {
    baseUrl: string;
}

export interface IService {
    client: AxiosInstance;
    baseUrl: string;
}
