<template>
    <BaseTableLayout
        :data="billingList"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                prop="customerName"
                min-width="200"
                :label="$t('billing.billing.billingTable.customerName')"
            />
            <el-table-column
                prop="table"
                min-width="100"
                :label="$t('billing.billing.billingTable.table')"
            >
                <template #default="scope">
                    <span class="totalBillingPrice">
                        {{ scope.row.table?.name || '' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="paymentTotal"
                min-width="180"
                :label="$t('billing.billing.billingTable.paymentTotal')"
            >
                <template #default="scope">
                    <span class="totalBillingPrice">
                        {{ parseMoney(scope.row.paymentTotal) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="payDate"
                :label="$t('billing.billing.billingTable.paymentTime')"
                align="center"
                min-width="180"
            >
                <template #default="scope">
                    {{
                        scope.row.paymentTime
                            ? parseDateTime(
                                  scope.row.paymentTime,
                                  YYYY_MM_DD_HYPHEN_HH_MM_COLON,
                              )
                            : ''
                    }}
                </template>
            </el-table-column>
            <el-table-column
                min-width="200"
                :label="$t('billing.billing.billingTable.billingStatus')"
                align="center"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${statusBadge(
                            scope.row.billingStatus,
                        )}`"
                    >
                        {{
                            $t(
                                `billing.billing.statusBillingOptions.${scope.row.billingStatus}`,
                            )
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                width="150"
                align="center"
                :label="$t('billing.billing.billingTable.action')"
            >
                <template #default="scope">
                    <div class="button-group">
                        <el-tooltip
                            effect="dark"
                            :content="$t('billing.billing.tooltip.edit')"
                            placement="top"
                            v-if="isCanUpdate"
                        >
                            <el-button
                                type="warning"
                                size="mini"
                                @click="onClickButtonEdit(scope.row)"
                            >
                                <EditIcon class="action-icon" />
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { billingModule } from '@billing/store';
import { IBilling, IBillingUpdate, BillingStatus } from '../types';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { UtilMixins } from '@/mixins/utilMixins';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
    },
})
export default class BillingTable extends mixins(UtilMixins) {
    get billingList(): IBilling[] {
        return billingModule.billingList;
    }

    get totalItems(): number {
        return billingModule.totalBillings;
    }

    get selectedPage(): number {
        return billingModule.billingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        billingModule.billingQueryString.page = value;
    }

    get isCanDelete(): boolean {
        return checkUserHasPermission(billingModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.DELETE}`,
        ]);
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(billingModule.userPermissions, [
            `${PermissionResources.BILLING}_${PermissionActions.UPDATE}`,
        ]);
    }

    async onClickButtonEdit(updateBilling: IBillingUpdate): Promise<void> {
        billingModule.setSelectedBilling(updateBilling);
        billingModule.setIsShowBillingFormPopUp(true);
    }

    statusBadge(status: BillingStatus): string {
        switch (status) {
            case BillingStatus.EATING:
                return 'warning';
            case BillingStatus.WAIT_FOR_PAY:
            case BillingStatus.WAIT_FOR_SELECT_FOOD:
                return 'info';
            case BillingStatus.PAID:
                return 'success';
            case BillingStatus.CANCELED:
                return 'danger';
        }
    }

    async getBillingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await billingModule.getBillingList();
        loading.close();
    }

    async handlePaginate(): Promise<void> {
        billingModule.setBillingQueryString({
            page: this.selectedPage,
        });
        this.getBillingList();
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
</style>
