import { FloorRestaurant } from './constants';
import { IQueryString } from '@/common/types';
export interface ITable {
    id: number;
    name: string;
    isUsed: boolean;
    status: string;
    numberSeat: number;
    floor: FloorRestaurant;
}

export interface IGetTables {
    tables: Array<ITable>;
    totalProduct: number;
}

export interface IPatchQueryTable {
    status: string;
    nameCustomer?: string;
    phone?: string;
    arrivalTime?: string;
}
export interface IQueryStringTable extends IQueryString {
    keyword?: string | null;
    floor?: FloorRestaurant;
}
