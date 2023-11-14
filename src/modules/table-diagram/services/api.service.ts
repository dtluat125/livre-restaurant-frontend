import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IBodyResponse } from '@common/types';
import { AxiosPromise } from 'axios';

class EventApiService extends BaseService {
    updateStatus<P, R extends IBodyResponse>(id: number, data: P): AxiosPromise {
        data = this.beforeUpdate<P>(data);
        return this.client.patch<R>(`${this.detailUrl}/${id}/status`, data);
    }
}
export const eventService = new EventApiService({ baseUrl: '/event' }, service);

class CategoryService extends BaseService {}
export const categoryService = new CategoryService({ baseUrl: 'category' }, service);

class FoodService extends BaseService {}
export const foodService = new FoodService({ baseUrl: 'food' }, service);

class TableService extends BaseService {}
export const tableService = new TableService({ baseUrl: '/table' }, service);

class RestaurantService extends BaseService {}
export const restaurantService = new RestaurantService(
    { baseUrl: 'restaurant' },
    service,
);

class BookingService extends BaseService {}
export const bookingService = new BookingService({ baseUrl: 'booking' }, service);
