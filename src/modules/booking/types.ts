import { BookingStatus } from './constants';
import { IQueryString } from '@/common/types';
import { ITable } from '../table-diagram/types';

export interface IBooking {
    id: number;
    nameCustomer: string;
    phone: string;
    arrivalTime: Date;
    status: string;
    tablesRestaurant: ITable;
    tableId: number;
    numberPeople: number;
}

export interface IBookingCreate {
    nameCustomer?: string | undefined;
    phone?: string | undefined;
    arrivalTime?: Date | string | undefined;
    numberPeople?: number | undefined;
    tableId?: number | undefined;
}

export interface IBookingUpdate extends IBookingCreate {
    id: number | undefined;
}

export interface IGetBookings {
    bookings: Array<IBooking>;
    totalProduct: number;
}

export interface IPatchBooking {
    status?: string;
    tableId?: number;
}
export interface IQueryStringBooking extends IQueryString {
    keyword?: string | null;
    status?: BookingStatus[] | null;
    arrivalTimeRange?: string[] | null;
    tableId?: number | null;
}

export type TModalType = 'Create' | 'Edit' | 'Close';

export interface ITextItem {
    name: string;
    number: number;
}
