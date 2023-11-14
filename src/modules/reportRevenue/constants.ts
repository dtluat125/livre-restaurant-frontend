import { SHIFT } from './types';
import yup from '@/plugins/yup/index';
import {
    INPUT_TEXT_MAX_LENGTH,
    INPUT_NUMBER_MAX_VALUE,
    INPUT_MONEY_MIN_VALUE,
} from '@/common/constants';

export const SHIFT_OPTIONS = [
    {
        label: 'reportRevenue.reportRevenue.shiftWork.morningShift',
        value: SHIFT.MORNING_SHIFT,
    },
    {
        label: 'reportRevenue.reportRevenue.shiftWork.afternoonShift',
        value: SHIFT.AFTERNOON_SHIFT,
    },
];

export enum AcceptStatus {
    APPROVE = 'APPROVE',
    WAITING_APPROVE = 'WAITING_APPROVE',
    REQUEST_CHECK_AGAIN = 'REQUEST_CHECK_AGAIN',
    CHECKED_AGAIN = 'CHECKED_AGAIN',
    REJECT = 'REJECT',
}

export const AcceptStatusOptions = [
    {
        label: 'app.acceptStatus.approve',
        value: AcceptStatus.APPROVE,
    },
    {
        label: 'app.acceptStatus.checkedAgain',
        value: AcceptStatus.CHECKED_AGAIN,
    },
    {
        label: 'app.acceptStatus.requestCheckAgain',
        value: AcceptStatus.REQUEST_CHECK_AGAIN,
    },
    {
        label: 'app.acceptStatus.waitingApprove',
        value: AcceptStatus.WAITING_APPROVE,
    },
    {
        label: 'app.acceptStatus.reject',
        value: AcceptStatus.REJECT,
    },
];

export const validateReportRevenueSchema = yup.object({
    shift: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(SHIFT))
        .nullable()
        .optional(),
    cashAtBeginningOfShift: yup
        .number()
        .min(INPUT_MONEY_MIN_VALUE)
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('cashAtBeginningOfShift'),
    billingRevenue: yup
        .number()
        .min(INPUT_MONEY_MIN_VALUE)
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('billingRevenue'),
    cashAtEndingOfShift: yup
        .number()
        .min(INPUT_MONEY_MIN_VALUE)
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('cashAtEndingOfShift'),
    bankingRevenue: yup
        .number()
        .min(INPUT_MONEY_MIN_VALUE)
        .max(INPUT_NUMBER_MAX_VALUE)
        .required()
        .label('bankingRevenue'),
    differenceRevenue: yup.number().label('differenceRevenue'),
    note: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).nullable().label('note'),
});
