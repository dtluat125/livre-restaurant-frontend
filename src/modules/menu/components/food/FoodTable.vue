<template>
    <BaseTableLayout
        :data="foodList"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                align="center"
                :label="$t('menu.food.foodTable.header.id')"
                type="index"
                width="75"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('menu.food.foodTable.header.name')"
                width="350"
            >
                <template #default="scope">
                    <div class="d-flex">
                        <BaseAvatar
                            :imageUrl="scope.row.foodImg.url"
                            :height="25"
                            :width="25"
                        />
                        <div class="ms-3 mt-1">{{ scope.row.foodName }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                :label="$t('menu.food.foodTable.header.price')"
                sortable="custom"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.price) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="category"
                :label="$t('menu.food.foodTable.header.category')"
            >
                <template #default="scope">
                    {{ scope.row.category.name }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                :label="$t('menu.food.foodTable.header.actions')"
                fixed="right"
                width="150"
            >
                <template #default="scope">
                    <div class="button-group">
                        <el-tooltip
                            effect="dark"
                            :content="$t('common.app.tooltip.edit')"
                            placement="top"
                            v-if="isCanUpdate(scope.row?.status)"
                        >
                            <el-button
                                type="warning"
                                size="mini"
                                @click="onClickButtonEdit(scope.row)"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('common.app.tooltip.delete')"
                            placement="top"
                            v-if="isCanDelete(scope.row?.status)"
                        >
                            <el-button
                                type="danger"
                                size="mini"
                                @click="onClickButtonDelete(scope.row?.id)"
                            >
                                <DeleteIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';

import CompIcon from '../../../../components/CompIcon.vue';
import { menuModule } from '../../store';
import { MenuMixins } from '../../mixins';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { IFood, IFoodUpdateBody } from '../../types';
import { setupDelete } from '../../composition/food';
import { setup } from 'vue-class-component';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';

@Options({
    name: 'material-table-component',
    components: {
        CompIcon,
        DeleteIcon,
        EditIcon,
    },
})
export default class MaterialTable extends mixins(MenuMixins) {
    deleteAction = setup(() => setupDelete());

    get foodList(): IFood[] {
        return menuModule.foodList;
    }

    get totalItems(): number {
        return menuModule.totalFoods;
    }

    get selectedPage(): number {
        return menuModule.foodQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        menuModule.foodQueryString.page = value;
    }

    created(): void {
        menuModule.getFoods();
    }

    isCanDelete(): boolean {
        return checkUserHasPermission(menuModule.userPermissionsFood, [
            `${PermissionResources.MENU_FOOD}_${PermissionActions.DELETE}`,
        ]);
    }

    isCanUpdate(): boolean {
        return checkUserHasPermission(menuModule.userPermissionsFood, [
            `${PermissionResources.MENU_FOOD}_${PermissionActions.UPDATE}`,
        ]);
    }

    async onClickButtonEdit(updateFood: IFoodUpdateBody): Promise<void> {
        menuModule.setFoodSelected(updateFood);
        menuModule.setIsShowFoodFormPopUp(true);
    }

    async onClickButtonDelete(id: number): Promise<void> {
        await this.deleteAction.deleteFood(id);
    }

    async getFoodList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await menuModule.getFoods();
        loading.close();
    }

    async handlePaginate(): Promise<void> {
        menuModule.setFoodQueryString({ page: this.selectedPage });
        this.getFoodList();
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
}

.action-icon {
    height: 1em;
    width: 1em;
}

.food-img {
    width: 25px;
}
</style>
