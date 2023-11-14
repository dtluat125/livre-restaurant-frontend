<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @search="handleFilter"
        @reset="resetFilter"
        @keyup.enter="handleFilter"
        :isShowCreateButton="isCanCreate"
        @create="onClickButtonCreate"
    >
        <template #filter-title>
            <h5 class="filter-title">{{ $t('common.app.filterForm.search') }}</h5>
        </template>
        <slot>
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <BaseInputText
                        v-model:value="filterForm.keyword"
                        :placeholder="$t('booking.booking.placeholder.keyword')"
                        :label="$t('booking.booking.filterForm.keyword')"
                    />
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { ElLoading } from 'element-plus';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    DEFAULT_SIZE_PER_PAGE,
    LIMIT_PER_PAGE,
} from '@/common/constants';
import { menuModule } from '../../store';
import { Prop, mixins } from 'vue-property-decorator';
import { MenuMixins } from '../../mixins';
import { IQueryStringFood } from '../../types';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';

export default class FilterForm extends mixins(MenuMixins) {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;

    // check permission
    get isCanCreate(): boolean {
        return checkUserHasPermission(menuModule.userPermissionsFood, [
            `${PermissionResources.MENU_FOOD}_${PermissionActions.CREATE}`,
        ]);
    }

    filterForm = {
        page: DEFAULT_FIRST_PAGE,
        limit: LIMIT_PER_PAGE,
        orderBy: DEFAULT_ORDER_BY,
        orderDirection: DEFAULT_ORDER_DIRECTION,
        keyword: '',
    } as IQueryStringFood;

    async resetFilter(): Promise<void> {
        this.filterForm = {
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
            orderBy: DEFAULT_ORDER_BY,
            orderDirection: DEFAULT_ORDER_DIRECTION,
            keyword: '',
        };
        menuModule.clearFoodQueryString();
        await this.handleFilter();
    }

    async handleFilter(): Promise<void> {
        menuModule.setFoodQueryString({
            page: DEFAULT_FIRST_PAGE,
            limit: DEFAULT_SIZE_PER_PAGE,
            keyword: this.filterForm.keyword?.trim(),
        });
        const loading = ElLoading.service({
            target: '.content',
        });
        await menuModule.getFoods();
        loading.close();
    }

    onClickButtonCreate(): void {
        menuModule.setIsShowFoodFormPopUp(true);
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
