import { IFood } from '@/modules/menu/types';

export interface IRevenueChart {
    day: number;
    month: number;
    revenue: number;
}

export interface IFoodRevenue extends IFood {
    quantity: number;
}

export interface IDashboardData {
    billingCount: number;
    revenueTotal: number;
}

export interface IUserTimeListQuery {
    dateRanges?: string[];
    dateRangeType: string;
}
