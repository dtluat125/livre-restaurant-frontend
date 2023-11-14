import { IFood } from './../menu/types';
import { ITable } from './../table-diagram/types';
import { IUser } from './../user/types';
import { IQueryString } from '@/common/types';

export enum BillingStatus {
    EATING = 'eating',
    WAIT_FOR_PAY = 'wait_for_pay',
    CANCELED = 'canceled',
    PAID = 'paid',
    WAIT_FOR_SELECT_FOOD = 'wait_for_select_food',
}

export enum ReasonCanceled {
    OUT_OF_FOOD = 'out_of_food',
    ANOTHER_REASON = 'another_reason',
}

export enum PaymentMethod {
    READY_CASH = 'ready_cash',
    BANKING = 'banking',
}

export interface IBilling {
    id: number;
    customerName: string;
    customerPhone: string;
    tableId: number;
    table: ITable;
    cashierId: number;
    cashier: IUser;
    paymentTotal: number;
    paymentMethod: PaymentMethod;
    paymentTime: string;
    arrivalTime: string | Date;
    billingStatus: BillingStatus;
    reasonCanceled: ReasonCanceled;
    note: string;
}

export interface IBillingCreate {
    id?: number | undefined;
    customerName: string | undefined;
    customerPhone: string | undefined;
    tableId: number | undefined;
    billingStatus: BillingStatus | undefined;
    arrivalTime: string | Date;
}

export interface IBillingUpdate {
    id?: number | undefined;
    customerName: string | undefined;
    customerPhone: string | undefined;
    cashierId: number | undefined;
    paymentMethod: PaymentMethod | undefined;
    paymentTotal: number | undefined;
    paymentTime: string | Date | undefined;
    billingStatus: BillingStatus | undefined;
    reasonCanceled?: ReasonCanceled | undefined;
    note: string | undefined;
}

export interface IQueryStringBilling extends IQueryString {
    keyword?: string;
    payerIds?: number[];
    paymentTimeRange?: string[] | null;
}

export interface IFoodBilling {
    id: number;
    foodId: number;
    food: IFood;
    billingId: number;
    singlePrice: number;
    quantity: number;
    note: string;
}

export interface IQueryStringFoodBilling extends IQueryString {
    keyword?: string;
    billingId?: number;
}
