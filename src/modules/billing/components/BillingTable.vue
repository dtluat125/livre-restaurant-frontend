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
                prop="id"
                min-width="200"
                :label="$t('billing.billing.billingTable.trace')"
            />
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
                                  DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_COLON,
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
                        <el-tooltip
                            effect="dark"
                            :content="$t('billing.billing.tooltip.export')"
                            placement="top"
                            v-if="isCanExport(scope.row)"
                        >
                            <el-button
                                type="primary"
                                size="mini"
                                :loading="
                                    scope.row.id === billingModule.selectedBilling?.id &&
                                    isExporting
                                "
                                @click="onClickButtonExport(scope.row)"
                            >
                                <el-icon class="el-icon--right"><Printer /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { billingModule } from '@billing/store';
import { IBillingUpdate, BillingStatus, IBilling } from '../types';
import { Edit as EditIcon, Printer } from '@element-plus/icons-vue';
import { PermissionActions, PermissionResources } from '@/modules/role/constants';
import { checkUserHasPermission } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { DATE_TIME_FORMAT, DEFAULT_FIRST_PAGE } from '@/common/constants';
import { parseDateTime, parseMoney } from '../../../utils/util';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const billingList = computed(() => billingModule.billingList);
const totalItems = computed(() => billingModule.totalBillings);
const selectedPage = ref(billingModule.billingQueryString?.page || DEFAULT_FIRST_PAGE);

const isCanUpdate = computed(() =>
    checkUserHasPermission(billingModule.userPermissions, [
        `${PermissionResources.BILLING}_${PermissionActions.UPDATE}`,
    ]),
);

const isCanExport = (billing: IBilling) => {
    return [BillingStatus.WAIT_FOR_PAY, BillingStatus.PAID].includes(
        billing.billingStatus,
    );
};

const onClickButtonEdit = async (updateBilling: IBillingUpdate): Promise<void> => {
    billingModule.setSelectedBilling(updateBilling);
    billingModule.setIsShowBillingFormPopUp(true);
};

const statusBadge = (status: BillingStatus): string => {
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
};

const getBillingList = async (): Promise<void> => {
    const loading = ElLoading.service({
        target: '.content',
    });
    await billingModule.getBillingList();
    loading.close();
};

const handlePaginate = async (): Promise<void> => {
    billingModule.setBillingQueryString({
        page: selectedPage.value,
    });
    await getBillingList();
};

const onClickButtonExport = async (billing: IBilling) => {
    billingModule.setSelectedBilling(billing);
    isExporting.value = true;
    await billingModule.getFoodBillingList();
    exportToPDF(billing);
    isExporting.value = false;
};

const isExporting = ref(false);

const exportToPDF = (billing: IBilling) => {
    const restaurantName = 'Livre Restaurant';
    const restaurantAddress = '123 Gourmet St, Food City, FC 12345';

    const docDefinition = {
        content: [
            { text: restaurantName, style: 'header', alignment: 'center' },
            { text: restaurantAddress, style: 'subheader', alignment: 'center' },
            { text: 'Invoice', style: 'invoiceTitle', margin: [0, 20, 0, 20] },
            {
                columns: [
                    {
                        width: '50%',
                        text: [
                            { text: 'Invoice ID: ', bold: true },
                            billing.id,
                            '\n',
                            billing.customerName && {
                                text: 'Customer Name: ',
                                bold: true,
                            },
                            billing.customerName,
                            '\n',
                            billing.customerPhone && {
                                text: 'Customer Phone: ',
                                bold: true,
                            },
                            billing.customerPhone,
                            '\n',
                            { text: 'Date: ', bold: true },
                            new Date(billing.paymentTime).toLocaleDateString(),
                            '\n',
                        ],
                    },
                ],
            },
            { text: ' ', margin: [0, 10, 0, 10] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            { text: 'Description', style: 'tableHeader' },
                            { text: 'Quantity', style: 'tableHeader' },
                            { text: 'Price', style: 'tableHeader' },
                            { text: 'Total', style: 'tableHeader' },
                        ],
                        ...billingModule.foodBillingList.map((item) => [
                            item.food?.foodName,
                            item.quantity,
                            parseMoney(item.food?.price),
                            parseMoney(item.quantity * item.food?.price),
                        ]),
                        [
                            {
                                text: 'Total',
                                colSpan: 3,
                                alignment: 'right',
                                style: 'tableTotal',
                            },
                            {},
                            {},
                            {
                                text: parseMoney(billing.paymentTotal),
                                style: 'tableTotal',
                            },
                        ],
                    ],
                },
                layout: 'lightHorizontalLines',
            },
            { text: ' ', margin: [0, 10, 0, 10] },
            {
                text: 'Thank you for dining with us!',
                style: 'footer',
                alignment: 'center',
            },
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                margin: [0, 0, 0, 5],
            },
            subheader: {
                fontSize: 14,
                margin: [0, 0, 0, 5],
            },
            invoiceTitle: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
            },
            tableTotal: {
                bold: true,
                fontSize: 13,
                color: 'black',
            },
            footer: {
                fontSize: 14,
                bold: true,
            },
        },
        defaultStyle: {
            fontSize: 12,
            columnGap: 20,
        },
    };
    pdfMake.createPdf(docDefinition).open();
};
onMounted(() => {
    getBillingList();
});
</script>
<style lang="scss" scoped>
.button-group {
    display: flex;
    flex-wrap: nowrap;
}

.action-icon {
    height: 1em;
    width: 1em;
}
</style>
