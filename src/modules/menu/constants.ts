import { INPUT_NUMBER_MAX_VALUE, TEXTAREA_MAX_LENGTH } from '@/common/constants';
import yup from '@/plugins/yup/index';

export const validateFoodSchema = yup.object({
    foodImgId: yup.number().positive().max(INPUT_NUMBER_MAX_VALUE).optional().nullable(),
    foodName: yup.string().trim().max(TEXTAREA_MAX_LENGTH).required(),
    price: yup
        .number()
        .integer()
        .min(0)
        .optional()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE)
        .required(),
    categoryId: yup.number().positive().nullable().required().label('category'),
});

export const validateCategorySchema = yup.object({
    name: yup.string().trim().max(TEXTAREA_MAX_LENGTH).required(),
    priority: yup
        .number()
        .integer()
        .min(0)
        .optional()
        .transform((val) => (isNaN(val) ? null : val))
        .max(INPUT_NUMBER_MAX_VALUE)
        .required(),
    note: yup.string().trim().nullable().max(TEXTAREA_MAX_LENGTH).optional(),
});
