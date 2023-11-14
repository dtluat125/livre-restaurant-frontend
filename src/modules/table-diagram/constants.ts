import {
    INPUT_NUMBER_MAX_VALUE,
    INPUT_TEXT_MAX_LENGTH,
    INPUT_URL_MAX_LENGTH,
    REGEX,
    TEXTAREA_MAX_LENGTH,
} from '@/common/constants';
import yup from '@/plugins/yup/index';

export const userQuantityRange = [[0, 50], [50, 100], [100]];

export enum TableStatus {
    BOOKED = 'booked',
    USED = 'used',
    READY = 'ready',
}

export enum FloorRestaurant {
    FIRST = 'first',
    SECOND = 'second',
    THIRD = 'third',
}

export const FloorOptions = [
    {
        label: 'tableDiagram.table.floorOptions.first',
        value: FloorRestaurant.FIRST,
    },
    {
        label: 'tableDiagram.table.floorOptions.second',
        value: FloorRestaurant.SECOND,
    },
    {
        label: 'tableDiagram.table.floorOptions.third',
        value: FloorRestaurant.THIRD,
    },
];

export const ALL_USER_QUANTITY_RANGE = -1;

export const EventSchema = yup.object({
    title: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).required().label('eventName'),
    description: yup.string().trim().nullable().max(TEXTAREA_MAX_LENGTH).optional(),
    imageUrl: yup.string().max(INPUT_URL_MAX_LENGTH).required().url().label('linkImage'),
    startDate: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
    endDate: yup.string().matches(REGEX.YYYY_MM_DD_HYPHEN).nullable().required(),
    userQuantity: yup
        .number()
        .integer()
        .min(0)
        .nullable()
        .optional()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE),
    budget: yup
        .number()
        .integer()
        .min(0)
        .optional()
        .nullable()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE),
});

export const LIMIT_ARRIVAL_TIME_BOOKING = 10800000;
