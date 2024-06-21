import { BaseService } from './../../../utils/api';
import {
    IRevenueChart,
    IUserTimeListQuery,
    IDashboardData,
    IFoodRevenue,
} from './../types';
import service from '@/plugins/axios';
import { IBodyResponse, IGetListResponse } from '@/common/types';

class DashboardService extends BaseService {
    getRevenueChartData(query: IUserTimeListQuery) {
        return this.client.get<void, IBodyResponse<IGetListResponse<IRevenueChart>>>(
            this.baseUrl + '/revenue',
            { params: query },
        );
    }

    getDashboardData(query: IUserTimeListQuery) {
        return this.client.get<void, IBodyResponse<IDashboardData>>(
            this.baseUrl + '/data',
            { params: query },
        );
    }

    getFoodRevenueData(query: IUserTimeListQuery) {
        return this.client.get<void, IBodyResponse<IGetListResponse<IFoodRevenue>>>(
            this.baseUrl + '/food',
            { params: query },
        );
    }
}

export const dashboardService = new DashboardService({ baseUrl: '/dashboard' }, service);
