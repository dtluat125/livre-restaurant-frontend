import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class BillingApiService extends BaseService {}
export const billingService = new BillingApiService({ baseUrl: '/billing' }, service);

class FoodBillingApiService extends BaseService {}
export const foodBillingApiService = new FoodBillingApiService(
    { baseUrl: '/food-billing' },
    service,
);
