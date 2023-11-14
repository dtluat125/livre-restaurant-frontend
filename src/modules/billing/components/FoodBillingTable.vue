<template>
    <BaseTableLayout
        :data="foodBillingTable"
        :isHighlightCurrentRow="true"
        :totalItems="foodBillingTable.length"
    >
        <template #table-columns>
            <el-table-column
                prop="food.name"
                :label="$t('billing.billing.foodBillingTable.food')"
            >
                <template #default="scope">
                    {{ scope.row.food?.foodName }}
                </template>
            </el-table-column>
            <el-table-column
                prop="food.price"
                width="150"
                :label="$t('billing.billing.foodBillingTable.price')"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.singlePrice) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="150"
                :label="$t('billing.billing.foodBillingTable.quantity')"
            >
                <template #default="scope">
                    {{ scope.row.quantity }}
                </template>
            </el-table-column>
            <el-table-column
                prop="total"
                width="150"
                :label="$t('billing.billing.foodBillingTable.total')"
            >
                <template #default="scope">
                    {{ parseMoney((scope.row.quantity * scope.row.food?.price) | 0) }}
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { IFoodBilling } from '../types';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { UtilMixins } from '@/mixins/utilMixins';
import { billingModule } from '../store';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
    },
})
export default class FoodBillingTable extends mixins(UtilMixins) {
    get foodBillingTable(): IFoodBilling[] {
        return billingModule.foodBillingList;
    }
}
</script>

<style lang="scss" scoped>
.button-group {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
}
.group-left {
    justify-content: space-between;
}
.action-icon {
    height: 1em;
    width: 1em;
}

.billing-image {
    text-decoration: underline;
}

.description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
}
</style>
