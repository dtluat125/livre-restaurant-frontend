<template>
    <div class="content-wrapper filter-wrapper">
        <FilterForm />
    </div>
    <div class="content-wrapper">
        <BaseEmptyBox
            v-if="totalItems === 0 && !loading"
            styleContainer="style-empty"
            :message="$t('user.list.filterForm.emptyMessage')"
        />
        <UserGrid v-else-if="!loading && totalItems > 0" />
    </div>

    <!-- Popup user form -->
    <UserFormPopup />
</template>

<script lang="ts">
import { UtilMixins } from '@/mixins/utilMixins';
import FilterForm from '../components/FilterForm.vue';
import UserGrid from '../components/UserGrid.vue';
import UserFormPopup from '../components/UserFormPopup.vue';
import { Options } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import { userModule } from '../store';
import { DEFAULT_FIRST_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/common/constants';
import { mixins } from 'vue-property-decorator';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { IUserPosition } from '../types';
import { generalSettingApiService } from '../services/api.service';
import { SettingKey } from '../constants';
@Options({
    components: {
        FilterForm,
        UserGrid,
        UserFormPopup,
    },
})
export default class UserListPage extends mixins(UtilMixins) {
    isToggleFilterForm = true;
    heightFilterForm = 0;

    get isCanCreate(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.CREATE}`,
        ]);
    }

    get totalItems(): number {
        return userModule.totalUsers;
    }

    get pageLimit(): number {
        return userModule.queryString.limit || DEFAULT_SIZE_PER_PAGE;
    }

    get selectedPage(): number {
        return userModule.queryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        userModule.queryString.page = value;
    }

    get uploadUserImage(): void {
        return require('@/assets/icons/btn.export.svg');
    }

    get uploadFingerImage(): void {
        return require('@/assets/icons/btn.import.svg');
    }

    created(): void {
        userModule.resetQueryString();
        const loading = ElLoading.service({
            target: '.content',
        });
        Promise.all([
            userModule.getProvinceList(),
            userModule.getUsers(),
            userModule.getRoleOptions(),
            this.getPositions(),
        ]);
        loading.close();
    }

    async getUsers(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await userModule.getUsers();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response?.message as string);
        }
    }

    async getPositions(): Promise<void> {
        const positions = await generalSettingApiService.getGeneralSetting({
            key: SettingKey.USER_POSITION,
        });

        if (positions.success) {
            userModule.setUserPositionList(positions.data.values as IUserPosition[]);
        }
    }

    onClickButtonCreate(): void {
        userModule.setIsShowUserFormPopup(true);
        userModule.setIsDisabledSaveButton(false);
    }

    toggleFilterForm(): void {
        this.isToggleFilterForm = !this.isToggleFilterForm;
    }

    async handlePaginate(): Promise<void> {
        userModule.setPage(this.selectedPage);
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await userModule.getUsers();
        loading.close();

        if (!response?.success) {
            this.showErrorNotification(response.message as string);
        }
    }

    onClickButtonUploadUserFile(): void {
        userModule.setIsOpenImportUserFilePopup(!userModule.isOpenImportUserFilePopup);
    }

    onClickButtonUploadUserFingerFile(): void {
        userModule.setIsOpenUploadFingerFilePopup(
            !userModule.getIsOpenUploadFingerFilePopup,
        );
    }
}
</script>
<style lang="scss" scoped>
.content-wrapper {
    margin: 20px 25px;
    padding: 20px 25px;
    padding-bottom: 30px;
    background-color: white;
    border-radius: 15px;
}

.filter-wrapper {
    margin-top: 0;
}
</style>
