import { INPUT_NUMBER_MAX_VALUE, INPUT_TEXT_MAX_LENGTH, REGEX } from '@/common/constants';
import yup from '@/plugins/yup/index';

export enum BookingStatus {
    WAITING = 'waiting',
    WAITING_FOR_APPROVE = 'waiting_for_approve',
    CANCELED = 'canceled',
    DONE = 'done',
}

export const userQuantityRange = [[0, 50], [50, 100], [100]];

export const bookingStatusOptions = [
    {
        label: 'booking.booking.status.done',
        value: BookingStatus.DONE,
    },
    {
        label: 'booking.booking.status.canceled',
        value: BookingStatus.CANCELED,
    },
    {
        label: 'booking.booking.status.waiting',
        value: BookingStatus.WAITING,
    },
    {
        label: 'booking.booking.status.waiting_for_approve',
        value: BookingStatus.WAITING_FOR_APPROVE,
    },
];

export const ALL_USER_QUANTITY_RANGE = -1;

export const BookingSchema = yup.object({
    nameCustomer: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional().nullable(),
    phone: yup
        .string()
        .trim()
        .matches(REGEX.PHONE_NUMBER, 'user.form.phoneNumber.invalid')
        .optional()
        .nullable(),
    numberPeople: yup
        .number()
        .integer()
        .min(0)
        .optional()
        .nullable()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE)
        .required(),
    arrivalTime: yup.string().optional().nullable().required(),
});

export const BookingGuestSchema = yup.object({
    nameCustomer: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional().required(),
    phone: yup
        .string()
        .trim()
        .matches(REGEX.PHONE_NUMBER, 'user.form.phoneNumber.invalid')
        .optional()
        .required(),
    numberPeople: yup
        .number()
        .integer()
        .min(0)
        .optional()
        .nullable()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE)
        .required(),
    arrivalTime: yup.string().optional().nullable().required(),
});

export const LIMIT_ARRIVAL_TIME_BOOKING = 10800;
