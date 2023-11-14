<template>
    <BaseTableLayout
        :data="reportRevenueList"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                prop="date"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.date')"
                align="center"
                min-width="150"
            >
                <template #default="scope">
                    {{
                        scope.row.createdAt
                            ? parseDateTime(scope.row.date, YYYY_MM_DD_HYPHEN)
                            : ''
                    }}
                </template>
            </el-table-column>
            <el-table-column
                width="150"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.shiftWork')"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${shiftBadge(
                            scope.row.shift,
                        )}`"
                    >
                        {{
                            $t(`reportRevenue.reportRevenue.shiftWork.${scope.row.shift}`)
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="shiftLeader.fullName"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.shiftLeader')"
                width="150"
            />
            <el-table-column
                prop="billingCount"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.billingCount')"
                width="180"
            >
                <template #default="scope">
                    {{ scope.row.billingCount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="billingRevenue"
                :label="
                    $t('reportRevenue.reportRevenue.reportRevenueTable.billingRevenue')
                "
                width="180"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.billingRevenue) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="cashAtBeginningOfShift"
                :label="
                    $t(
                        'reportRevenue.reportRevenue.reportRevenueTable.cashAtBeginningOfShift',
                    )
                "
                width="300"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.cashAtBeginningOfShift) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="cashAtEndingOfShift"
                :label="
                    $t(
                        'reportRevenue.reportRevenue.reportRevenueTable.cashAtEndingOfShift',
                    )
                "
                width="300"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.cashAtEndingOfShift) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="bankingRevenue"
                :label="
                    $t('reportRevenue.reportRevenue.reportRevenueTable.bankingRevenue')
                "
                width="250"
            >
                <template #default="scope">
                    {{ parseMoney(scope.row.bankingRevenue) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="differenceRevenue"
                :label="
                    $t('reportRevenue.reportRevenue.reportRevenueTable.differenceRevenue')
                "
                width="250"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${differenceRevenueBadge(
                            scope.row.shift,
                        )}`"
                    >
                        {{ parseMoney(scope.row.differenceRevenue) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="note"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.note')"
                width="150"
            />
            <el-table-column
                prop="status"
                width="150"
                fixed="right"
                align="center"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.status')"
            >
                <template #default="scope">
                    <MenuAcceptStatus
                        :status="scope.row.status"
                        :canApprove="isCanApproveStatus"
                        :id="scope.row.id"
                        @set-status="setStatus"
                    />
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                width="140"
                align="center"
                :label="$t('reportRevenue.reportRevenue.reportRevenueTable.action')"
            >
                <template #default="scope">
                    <div class="button-group">
                        <el-tooltip
                            effect="dark"
                            :content="$t('reportRevenue.reportRevenue.tooltip.edit')"
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
import { Options, setup } from 'vue-class-component';
import { mixins } from 'vue-property-decorator';
import { setupDelete } from '../composition/reportRevenue';
import { Delete as DeleteIcon, Edit as EditIcon } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import {
    checkUserHasPermission,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { UtilMixins } from '@/mixins/utilMixins';
import { reportRevenueModule } from '../store';
import { IReportRevenue, IReportRevenueUpdateBody, SHIFT } from '../types';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { reportRevenueService } from '../services/report-revenue.api.services';
import MenuAcceptStatus from '@/layouts/components/MenuAcceptStatus.vue';
import { IEmitStatus } from '@/common/types';
import i18n from '@/plugins/vue-i18n';

@Options({
    components: {
        DeleteIcon,
        EditIcon,
        MenuAcceptStatus,
    },
})
export default class ReportRevenueTable extends mixins(UtilMixins) {
    deleteAction = setup(() => setupDelete());

    get reportRevenueList(): IReportRevenue[] {
        return reportRevenueModule.reportRevenueList;
    }

    get totalItems(): number {
        return reportRevenueModule.totalReportRevenueList;
    }

    get selectedPage(): number {
        return reportRevenueModule.reportRevenueQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        reportRevenueModule.reportRevenueQueryString.page = value;
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(reportRevenueModule.userPermissions, [
            `${PermissionResources.REPORT_REVENUE}_${PermissionActions.UPDATE}`,
        ]);
    }

    get isCanApproveStatus(): boolean {
        console.log(
            checkUserHasPermission(reportRevenueModule.userPermissions, [
                `${PermissionResources.REPORT_REVENUE}_${PermissionActions.APPROVE_STATUS}`,
            ]),
        );

        return checkUserHasPermission(reportRevenueModule.userPermissions, [
            `${PermissionResources.REPORT_REVENUE}_${PermissionActions.APPROVE_STATUS}`,
        ]);
    }

    async onClickButtonEdit(
        updateReportRevenue: IReportRevenueUpdateBody,
    ): Promise<void> {
        reportRevenueModule.setSelectedReportRevenue(updateReportRevenue);
        reportRevenueModule.setIsShowReportRevenueFormPopUp(true);
    }

    async onClickButtonDelete(id: number): Promise<void> {
        await this.deleteAction.deleteReportRevenue(id);
    }

    differenceRevenueBadge(difference: number): string {
        if (difference >= 0) return 'success';
        else {
            return 'danger';
        }
    }

    shiftBadge(shift: SHIFT): string {
        switch (shift) {
            case SHIFT.MORNING_SHIFT:
                return 'info';
            case SHIFT.AFTERNOON_SHIFT:
                return 'warning';
            default:
                return '';
        }
    }

    async getReportRevenueList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await reportRevenueModule.getReportRevenueList();
        loading.close();
    }

    async handlePaginate(): Promise<void> {
        reportRevenueModule.setReportRevenueQueryString({
            page: this.selectedPage,
        });
        this.getReportRevenueList();
    }

    async setStatus(data: IEmitStatus): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });

        const response = await reportRevenueService.update(data.id, {
            status: data.status,
        });

        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('store.checkInventory.message.update.success'),
            );
            const loading = ElLoading.service({
                target: '.content',
            });
            await reportRevenueModule.getReportRevenueList();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            await reportRevenueModule.getReportRevenueList();
            loading.close();
        }
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
