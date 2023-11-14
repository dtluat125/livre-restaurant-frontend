import { AcceptStatus } from './../../common/constants';
import { IUser } from '@/modules/user/types';
import { IQueryString } from '@/common/types';

export enum SHIFT {
    MORNING_SHIFT = 'morningShift',
    AFTERNOON_SHIFT = 'afternoonShift',
}

export interface IReportRevenue {
    id: number;
    shift: SHIFT;
    shiftLeaderId: number;
    shiftLeader: IUser;
    cashAtBeginningOfShift: number;
    billingRevenue: number;
    cashAtEndingOfShift: number;
    bankingRevenue: number;
    differenceRevenue: number;
    date: string;
    billingCount: number;
    status: AcceptStatus;
    note: string;
}

export interface IReportRevenueUpdateBody {
    id: number | undefined;
    shift: SHIFT | undefined;
    shiftLeaderId: number | undefined;
    shiftLeader: IUser | undefined;
    cashAtBeginningOfShift: number | undefined;
    cashAtEndingOfShift: number | undefined;
    bankingRevenue: number | undefined;
    differenceRevenue: number | undefined;
    date: string | undefined;
    billingCount: number | undefined;
    status: AcceptStatus | undefined;
    note: string | undefined;
}

export interface IQueryStringReportRevenue extends IQueryString {
    keyword?: string;
    payerIds?: number[];
    dateRange?: string[] | null;
}
