import { BillingStatus, PaymentMethod } from './types';
import yup from '@/plugins/yup/index';
import { INPUT_TEXT_MAX_LENGTH, REGEX } from '@/common/constants';

export const BillingStatusOptions = [
    {
        label: 'billing.billing.statusBillingOptions.eating',
        value: BillingStatus.EATING,
    },
    {
        label: 'billing.billing.statusBillingOptions.canceled',
        value: BillingStatus.CANCELED,
    },
    {
        label: 'billing.billing.statusBillingOptions.wait_for_pay',
        value: BillingStatus.WAIT_FOR_PAY,
    },
    {
        label: 'billing.billing.statusBillingOptions.paid',
        value: BillingStatus.PAID,
    },
    {
        label: 'billing.billing.statusBillingOptions.wait_for_select_food',
        value: BillingStatus.WAIT_FOR_SELECT_FOOD,
    },
];

export const PaymentMethodOptions = [
    {
        label: 'billing.billing.paymentMethodOptions.banking',
        value: PaymentMethod.BANKING,
    },
    {
        label: 'billing.billing.paymentMethodOptions.ready_cash',
        value: PaymentMethod.READY_CASH,
    },
];

export const validateBillingSchema = yup.object({
    customerName: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('billingName'),
    customerPhone: yup.string().trim().matches(REGEX.PHONE_NUMBER).optional(),
    paymentMethod: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(PaymentMethod))
        .nullable()
        .optional()
        .required(),
    billingStatus: yup
        .string()
        .max(INPUT_TEXT_MAX_LENGTH)
        .oneOf(Object.values(BillingStatus))
        .nullable()
        .optional(),
    paymentTime: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN_HH_MM_COLON),
    cashier: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('cashier'),
    note: yup
        .string()
        .trim()
        .max(INPUT_TEXT_MAX_LENGTH)
        .optional()
        .nullable()
        .label('note'),
});
