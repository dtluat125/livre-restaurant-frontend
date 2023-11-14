<template>
    <BaseFilterFormLayout
        @search="state.applyFilter"
        @reset="state.clearFilter"
        @keyup.enter="handleFilter"
        :isShowCreateButton="isCanCreate"
        @create="onClickButtonCreate"
    >
        <template #filter-title>
            <h5 class="filter-title">
                {{ $t('common.app.filterForm.search') }}
            </h5>
        </template>
        <slot>
            <div class="row">
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseInputText
                        v-model:value="state.filterForm.keyword"
                        :label="$t('user.list.filterForm.keyword.label')"
                        :placeholder="$t('user.list.filterForm.keyword.placeholder')"
                        @keyup.enter="onEnter"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="state.filterForm.roles"
                        :label="$t('user.list.filterForm.role.label')"
                        :options="roleOptions"
                        :placeholder="$t('user.list.filterForm.role.placeholder')"
                        :filterable="true"
                        @keyup.enter="onEnter"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="state.filterForm.statuses"
                        :label="$t('user.list.filterForm.status.label')"
                        :options="statusOptions"
                        :placeholder="$t('user.list.filterForm.status.placeholder')"
                        @keyup.enter="onEnter"
                    />
                </div>
            </div>
            <div class="row pt-2">
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="state.filterForm.genders"
                        :label="$t('user.list.filterForm.gender.label')"
                        :options="genderOptions"
                        :placeholder="$t('user.list.filterForm.gender.placeholder')"
                        @keyup.enter="onEnter"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="state.filterForm.provinces"
                        :label="$t('user.list.filterForm.province.label')"
                        :options="provincesOptions"
                        :placeholder="$t('user.list.filterForm.province.placeholder')"
                        :filterable="true"
                        @keyup.enter="onEnter"
                    />
                </div>
                <div class="col-xl-4 col-md-6 col-12">
                    <BaseMultipleSelect
                        v-model:value="state.filterForm.positions"
                        :label="$t('user.list.filterForm.position.label')"
                        :options="positionOptions"
                        :placeholder="$t('user.list.filterForm.position.placeholder')"
                        :filterable="true"
                        @keyup.enter="onEnter"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { applyFilter, handleFilter } from '../composition/userList';
import { ISelectOptions } from '@/common/types';
import { checkUserHasPermission, parseLanguageSelectOptions } from '@/utils/helper';
import { GenderOptions, StatusOptions } from '../constants';
import { userModule } from '../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';

@Options({})
export default class FilterForm extends mixins(UtilMixins) {
    get roleOptions(): Record<string, string | number>[] {
        return userModule.roleOptions;
    }

    get statusOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(StatusOptions);
    }

    get genderOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(GenderOptions);
    }

    get provincesOptions(): ISelectOptions[] {
        return userModule.provinceOptions;
    }

    get positionOptions(): ISelectOptions[] {
        return this.getPositionOptions(userModule.userPositionList);
    }

    get isCanCreate(): boolean {
        return checkUserHasPermission(userModule.userPermissions, [
            `${PermissionResources.USER}_${PermissionActions.CREATE}`,
        ]);
    }

    onClickButtonCreate(): void {
        userModule.setIsShowUserFormPopup(true);
        userModule.setIsDisabledSaveButton(false);
    }

    state = setup(() => {
        const { filterForm, applyFilter, clearFilter } = handleFilter();
        return {
            filterForm,
            applyFilter,
            clearFilter,
        };
    });

    onEnter(): void {
        (this.state.applyFilter as applyFilter)();
    }
}
</script>

<style lang="scss" scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}
.form-group {
    margin-bottom: 10px !important;
}
:deep(label) {
    font-size: 13px;
}
</style>
