import { useField, useForm } from 'vee-validate';
import yup from '@/plugins/yup/index';
import { authModule } from '@auth/store';
import { GenderArray, UserGender } from '@/modules/auth/constants';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import {
    INPUT_NUMBER_MAX_VALUE,
    INPUT_TEXT_MAX_LENGTH,
    REGEX,
    TEXTAREA_MAX_LENGTH,
} from '@/common/constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { IUser } from '../user/types';
import trim from 'lodash/trim';

export const initEditForm = () => {
    const { t } = useI18n();
    const initValues = {
        phoneNumber: '',
        fullName: '',
        address: '',
        position: '',
        birthday: null,
        gender: '',
        avatarId: null,
        provinceId: null,
    };

    const { handleSubmit, errors, validate, resetForm } = useForm({
        initialValues: initValues,
        validationSchema: yup.object({
            fullName: yup.string().trim().required().max(INPUT_TEXT_MAX_LENGTH),
            birthday: yup
                .string()
                .matches(REGEX.YYYY_MM_DD_HYPHEN)
                .max(INPUT_TEXT_MAX_LENGTH)
                .optional()
                .nullable(),
            gender: yup.string().oneOf(GenderArray).nullable().required(),
            position: yup.string().optional().nullable(),
            address: yup.string().trim().optional().max(TEXTAREA_MAX_LENGTH).nullable(),
            phoneNumber: yup
                .string()
                .trim()
                .matches(REGEX.PHONE_NUMBER, 'auth.profile.messages.invalidPhoneNumber')
                .required()
                .nullable(),

            avatarId: yup
                .number()
                .positive()
                .max(INPUT_NUMBER_MAX_VALUE)
                .optional()
                .nullable(),

            provinceId: yup
                .number()
                .positive()
                .max(INPUT_NUMBER_MAX_VALUE)
                .optional()
                .nullable()
                .required()
                .label('province'),
        }),
    });

    const onSubmit = handleSubmit(async (values) => {
        const loading = ElLoading.service({
            target: '.edit-profile-form-popup',
        });
        const newProfile = {
            fullName: trim(values.fullName as string),
            phoneNumber: trim(values.phoneNumber as string),
            birthday: values.birthday
                ? moment(values.birthday).utc().fmFullTimeString()
                : null,
            address: trim(values.address as string),
            avatarId: values.avatarId as number,
            gender: values.gender as UserGender,
            position: values.position as string,
            provinceId: values.provinceId as number,
        } as IUser;
        const result = await authModule.updateProfile(newProfile);
        if (result.success) {
            await authModule.getProfile();
            showSuccessNotificationFunction(
                t('auth.profile.messages.updateProfileSuccess') as string,
            );
        } else {
            showErrorNotificationFunction(result.message as string);
        }
        loading.close();
        authModule.setIsShowPopupEditProfile(false);
    });
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: fullName } = useField('fullName');
    const { value: address } = useField('address');
    const { value: birthday } = useField('birthday');
    const { value: gender } = useField('gender');
    const { value: position } = useField('position');
    const { value: avatarId } = useField('avatarId');
    const { value: provinceId } = useField('provinceId');

    const openPopup = () => {
        const profile = authModule.userProfile;
        resetForm({
            values: {
                ...profile,
                birthday: profile.birthday
                    ? moment(profile.birthday).fmDayString()
                    : null,
                position: profile?.position as unknown as string,
            },
        });
    };
    return {
        errors,
        onSubmit,
        phoneNumber,
        avatarId,
        fullName,
        position,
        address,
        birthday,
        gender,
        provinceId,
        validate,
        resetForm,
        openPopup,
    };
};
