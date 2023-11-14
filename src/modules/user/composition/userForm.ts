import yup from '@/plugins/yup/index';
import trim from 'lodash/trim';
import moment from 'moment';
import { useField, useForm } from 'vee-validate';
import i18n from '@/plugins/vue-i18n';
import { IBodyResponse } from '@/common/types';
import { userModule } from '../store';
import { IUser, IUserUpdate } from '../types';
import { userApiService } from '../services/api.service';
import { UserGender } from '../constants';
import { authModule } from '@/modules/auth/store';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { computed } from 'vue';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';

export function initForm(
    validSchema: yup.SchemaOf<IUser>,
): Record<string, string | unknown> {
    const { errors, validate, resetForm, setErrors } = useForm<IUser>({
        validationSchema: validSchema,
    });
    const initUser = {
        fullName: '',
        email: '',
        phoneNumber: '',
        birthday: null,
        gender: null,
        roleId: null,
        position: '',
        address: '',
        avatarId: null,
        provinceId: null,
        note: '',
    };
    const isCreate = computed(() => !userModule.selectedUser?.id);
    const { value: email } = useField('email');
    const { value: fullName } = useField('fullName');
    const { value: phoneNumber } = useField('phoneNumber');
    const { value: birthday } = useField('birthday');
    const { value: address } = useField('address');
    const { value: gender } = useField('gender');
    const { value: roleId } = useField('roleId');
    const { value: position } = useField('position');
    const { value: avatarId } = useField('avatarId');
    const { value: note } = useField('note');
    const { value: provinceId } = useField('provinceId');

    const openPopup = async () => {
        setErrors({});
        if (!isCreate.value) {
            const userResponse: IBodyResponse<IUser> = (await userApiService.getDetail(
                userModule.selectedUser?.id ? userModule.selectedUser?.id : 0,
            )) as IBodyResponse<IUser>;
            userModule.setAvatarUrl(userResponse?.data?.avatar?.url as string);
            resetForm({
                values: {
                    ...userResponse?.data,
                    birthday: userResponse?.data?.birthday
                        ? moment(userResponse?.data?.birthday).fmDayString()
                        : null,
                } as IUser,
            });
        } else {
            resetForm({
                values: initUser as IUser,
            });
        }
    };

    return {
        email,
        fullName,
        phoneNumber,
        birthday,
        address,
        avatarId,
        gender,
        roleId,
        provinceId,
        note,
        position,
        errors,
        openPopup,
        validate,
        resetForm,
    };
}

export function parseDataToSubmit(form: Record<string, string | number | IUser>): IUser {
    return {
        email: trim(form.email as string),
        fullName: trim(form.fullName as string),
        phoneNumber: trim(form.phoneNumber as string),
        birthday: form.birthday
            ? moment(form.birthday as string)
                  .utc()
                  .fmFullTimeString()
            : null,
        address: trim(form.address as string),
        avatarId: form.avatarId as number,
        gender: form.gender as UserGender,
        roleId: form.roleId as number,
        provinceId: form.provinceId as number,
        position: form.position as string,
        note: trim(form.note as string),
    } as IUser;
}

export async function submitForm(user: IUser): Promise<void> {
    let response;

    if (!userModule.selectedUser?.id) {
        const loading = ElLoading.service({
            target: '.content',
        });
        response = await userApiService.create(user);
        loading.close();
    } else {
        const updateUser: IUserUpdate = user;
        delete updateUser.email;
        const loading = ElLoading.service({
            target: '.content',
        });
        response = await userApiService.update(userModule.selectedUser?.id, updateUser);
        loading.close();
        userModule.setIsShowUserFormPopup(false);
    }
    if (response?.success) {
        showSuccessNotificationFunction(
            (!userModule.selectedUser?.id
                ? i18n.global.t('user.form.message.createSuccess')
                : i18n.global.t('user.form.message.updateSuccess')) as string,
        );
        // reload user list and user profile
        const loading = ElLoading.service({
            target: '.content',
        });

        userModule.setQueryString({
            ...userModule.queryString,
            page: DEFAULT_FIRST_PAGE,
        });
        await userModule.getUsers();
        await authModule.getProfile();
        loading.close();
        userModule.setIsShowUserFormPopup(false);
    } else {
        showErrorNotificationFunction(response.message as string);
        if (response.code === HttpStatus.ITEM_NOT_FOUND) {
            const loading = ElLoading.service({
                target: '.content',
            });
            await userModule.getUsers();
            loading.close();
        }

        userModule.setIsShowUserFormPopup(true);
    }
}

export async function deleteUser(userId: number): Promise<void> {
    const result = await showConfirmPopUpFunction(
        i18n.global.t('user.list.deleteUser.confirmPopup.message') as string,
        i18n.global.t('user.list.deleteUser.confirmPopup.title') as string,
        {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    );

    if (result) {
        const response = await userApiService.delete(userId);
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t(
                    'user.list.deleteUser.notification.messageSuccess',
                ) as string,
            );
            // return to first page when deleted user
            userModule.setQueryString({
                ...userModule.queryString,
                page: DEFAULT_FIRST_PAGE,
            });
            await userModule.getUsers();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                await userModule.getUsers();
            }
        }
    }
}
