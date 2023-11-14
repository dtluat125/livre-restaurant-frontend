import i18n from '@/plugins/vue-i18n';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { roleApiService } from '../services/api.service';
import { roleModule } from '../store';
import { IRole } from '../types';

export const roleAction = () => {
    const deleteRole = async (role: IRole) => {
        const confirmation = await showConfirmPopUpFunction(
            i18n.global.t('role.list.confirmDelete.deleteConfirmText') as string,
            i18n.global.t('role.list.confirmDelete.deleteConfirmTitle') as string,
        );
        if (confirmation) {
            const loading = ElLoading.service({ target: 'el-content' });

            const response = await roleApiService.delete(role.id as number);
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('role.list.confirmDelete.success.message'),
                );
                await roleModule.getRoles();
                if (roleModule.roles.length > 0) {
                    await roleModule.getRole(roleModule.roles[0]?.id as number);
                }
            } else if (!response?.isRequestError) {
                showErrorNotificationFunction(response.message);
            }
            loading.close();
        }
    };
    return {
        deleteRole,
    };
};
