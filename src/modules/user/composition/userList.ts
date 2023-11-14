import { IUser } from '../types';
import { UserStatus } from './../constants';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { userModule } from '../store';
import i18n from '@/plugins/vue-i18n';
import { reactive } from '@vue/reactivity';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';

export type applyFilter = () => Promise<void>;

// filter form
export function handleFilter(): Record<string, string | unknown> {
    const filterForm = reactive({
        keyword: '',
        roles: [],
        statuses: [],
        genders: [],
        provinces: [],
        positions: [],
    });

    const clearFilter = async () => {
        filterForm.keyword = '';
        filterForm.roles = [];
        filterForm.statuses = [];
        filterForm.genders = [];
        filterForm.provinces = [];
        filterForm.positions = [];
        userModule.clearQueryString();
        await applyFilter();
    };

    const applyFilter = async () => {
        filterForm.keyword = filterForm.keyword?.trim();
        userModule.setFilterForm({
            genders: filterForm.genders,
            statuses: filterForm.statuses,
            roles: filterForm.roles,
            provinces: filterForm.provinces,
            positions: filterForm.positions,
            keyword: filterForm.keyword,
        });
        userModule.setPage(DEFAULT_FIRST_PAGE);
        const loading = ElLoading.service({
            target: '.content',
        });
        await userModule.getUsers();
        loading.close();
    };

    return {
        filterForm,
        applyFilter,
        clearFilter,
    };
}

// update user's status
export function setupUpdateStatus(props: { user: IUser }): Record<string, unknown> {
    // get list of editable status

    // handle update activity
    const { id } = props.user as IUser;
    const updateStatus = async (newStatus: UserStatus) => {
        const action: string = i18n.global.t(
            `user.list.updateStatus.confirmPopup.${newStatus}`,
        ) as string;
        const result = await showConfirmPopUpFunction(
            i18n.global.t('user.list.updateStatus.confirmPopup.message', {
                action,
            }) as string,
            i18n.global.t('user.list.updateStatus.confirmPopup.title') as string,
            {
                type: 'info',
                confirmButtonText: i18n.global.t('user.form.button.submit') as string,
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
        );

        if (result) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await userModule.updateStatus({
                id,
                status: newStatus,
            });
            loading.close();
            if (response?.success) {
                showSuccessNotificationFunction(
                    i18n.global.t(
                        'user.list.updateStatus.notification.messageSuccess',
                    ) as string,
                );
                const loading = ElLoading.service({
                    target: '.content',
                });
                await userModule.getUsers();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message as string);

                if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                    const loading = ElLoading.service({
                        target: '.content',
                    });
                    await userModule.getUsers();
                    loading.close();
                }
            }
        }
    };

    return { updateStatus };
}
