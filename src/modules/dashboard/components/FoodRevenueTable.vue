<template>
    <div row>
        <BaseTableLayout
            :data="foodList"
            :isHighlightCurrentRow="true"
            :isShowPagination="false"
            :totalItems="foodList.length"
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
                    width="250"
                >
                    <template #default="scope">
                        <div class="d-flex">
                            <BaseAvatar
                                :imageUrl="scope.row.foodImg?.url"
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
                    prop="quantity"
                    :label="$t('menu.food.foodTable.header.quantity')"
                    sortable="custom"
                >
                    <template #default="scope">
                        {{ scope.row.quantity }}
                    </template>
                </el-table-column>
            </template>
        </BaseTableLayout>
    </div>
</template>

<script setup lang="ts">
import { parseMoney } from '../../../utils/util';
import { IFoodRevenue } from '../types';

const props = defineProps<{ foodList: IFoodRevenue[] }>();
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
