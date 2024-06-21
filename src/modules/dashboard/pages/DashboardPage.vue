<template>
    <div class="statistic-wrapper">
        <el-button type="primary" @click="exportToPdf">
            Print <el-icon class="el-icon--right"><Printer /></el-icon>
        </el-button>
        <div class="content-wrapper">
            <BaseFilterFormLayout
                @search="handleFilter"
                @reset="resetFilter"
                @keyup.enter="handleFilter"
                :createButtonText="$t('user.filterForm.create')"
                :isShowCreateButton="false"
            >
                <slot>
                    <BaseSingleSelect
                        v-model:value="filterForm.dateRangeType"
                        :options="dateRangeTypeOptions"
                        :clearable="false"
                        :label="
                            $t(
                                'dashboard.dashboard.StatisticalChart.filterForm.revenue.dateRangeType.label',
                            )
                        "
                        :placeholder="
                            $t(
                                'dashboard.dashboard.StatisticalChart.filterForm.revenue.dateRangeType.placeholder',
                            )
                        "
                    />
                    <BaseDatePicker
                        v-model:value="filterForm.dateRange"
                        :type="
                            filterForm.dateRangeType === DateRangeTypes.MONTH
                                ? 'year'
                                : 'month'
                        "
                        :dateFormat="
                            filterForm.dateRangeType === DateRangeTypes.MONTH
                                ? DATE_TIME_FORMAT.YYYY
                                : DATE_TIME_FORMAT.YYYY_MM_HYPHEN
                        "
                        :clearable="false"
                        :label="
                            $t(
                                'dashboard.dashboard.StatisticalChart.filterForm.revenue.dateRange.label',
                            )
                        "
                        :placeholder="
                            $t(
                                'dashboard.dashboard.StatisticalChart.filterForm.revenue.dateRange.placeholder',
                            )
                        "
                    />
                </slot>
            </BaseFilterFormLayout>
        </div>
        <div class="content-wrapper row revenue-card">
            <RevenueCard :dashboardData="dashboardData" />
        </div>
        <div class="content-wrapper revenue-chart">
            <RevenueChart :filterForm="finalFilterForm" />
        </div>

        <div class="content-wrapper food-table">
            <FoodRevenueTable :foodList="foodList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import RevenueChart from '../components/RevenueChart.vue';
import { Printer } from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import { throttle } from 'lodash';
import { DateRangeTypeOptions, DateRangeTypes } from '../constant';
import { dashboardService } from '../services/api.services';
import { DATE_TIME_FORMAT } from '@/common/constants';
import moment from 'moment';
import { IDashboardData, IFoodRevenue } from '../types';
import FoodRevenueTable from '@/modules/dashboard/components/FoodRevenueTable.vue';
import RevenueCard from '@/modules/dashboard/components/RevenueCard.vue';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { getDateRanges } from '../utils';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { parseMoney } from '@/utils/util';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Define reactive state
const dashboardData = reactive<IDashboardData>({
    billingCount: 0,
    revenueTotal: 0,
});

const foodList = ref<IFoodRevenue[]>([]);

const chartImage = ref('');

const filterForm = reactive({
    dateRangeType: DateRangeTypes.MONTH,
    dateRange: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
});

const finalFilterForm = reactive<any>({
    dateRangeType: DateRangeTypes.MONTH,
    dateRange: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
});

const throttledCreateChart = throttle(createChart, 2000, { trailing: false });

async function createChart() {
    const cardLoading = ElLoading.service({ target: '.revenue-card' });
    const chartLoading = ElLoading.service({ target: '.revenue-chart' });
    const tableLoading = ElLoading.service({ target: '.food-table' });

    finalFilterForm.dateRangeType = filterForm.dateRangeType;
    finalFilterForm.dateRange = filterForm.dateRange;

    const dateRanges = getDateRanges(filterForm) || [
        moment(new Date())
            .startOf('month')
            .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
        moment(new Date())
            .endOf('month')
            .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
    ];

    const revenueResponse = await dashboardService.getDashboardData({
        dateRangeType: DateRangeTypes.MONTH,
        dateRanges,
    });
    const foodRevenueResponse = await dashboardService.getFoodRevenueData({
        dateRangeType: DateRangeTypes.MONTH,
        dateRanges,
    });

    if (foodRevenueResponse.success) {
        foodList.value = foodRevenueResponse.data?.items;
    }

    if (revenueResponse.success) {
        Object.assign(dashboardData, revenueResponse.data);
    } else {
        Object.assign(dashboardData, {
            billingCount: 0,
            revenueTotal: 0,
        });
    }

    cardLoading.close();
    chartLoading.close();
    tableLoading.close();
    const chart = document.getElementById('chart') as any;
    console.log(chart);
    setTimeout(() => {
        chartImage.value = chart.toDataURL();
    }, 200); // Timeout to ensure chart has rendered
}

async function handleFilter() {
    await throttledCreateChart();
}

const dateRangeTypeOptions = computed<ISelectOptions[]>(() =>
    parseLanguageSelectOptions(DateRangeTypeOptions),
);

async function resetFilter() {
    filterForm.dateRangeType = DateRangeTypes.MONTH;
    filterForm.dateRange = moment().format(
        DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON,
    );
    finalFilterForm.value = filterForm;
    await throttledCreateChart();
}

async function exportToPdf() {
    const docDefinition = {
        content: [
            {
                text: `Livre Restaurant Report for ${
                    filterForm.dateRangeType === DateRangeTypes.MONTH ? 'year' : 'month'
                } ${moment(filterForm.dateRange).get(
                    filterForm.dateRangeType === DateRangeTypes.MONTH ? 'year' : 'month',
                )}`,
                style: 'header',
            },
            {
                text: `Revenue: ${parseMoney(dashboardData.revenueTotal)}`,
                style: 'subheader',
            },
            { text: `Total Bills: ${dashboardData.billingCount}`, style: 'subheader' },

            { text: 'Statistics Chart:', style: 'subheader' },
            { image: chartImage.value, width: 400, height: 200, style: 'image' },

            { text: 'Food Revenue:', style: 'subheader' },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', '*', 'auto'],
                    body: [
                        [
                            { text: 'ID', style: 'tableHeader' },
                            { text: 'Name', style: 'tableHeader' },
                            { text: 'Price', style: 'tableHeader' },
                            { text: 'Category', style: 'tableHeader' },
                            { text: 'Quantity Sold', style: 'tableHeader' },
                        ],
                        ...foodList.value.map((item) => [
                            item.id,
                            item.foodName,
                            parseMoney(item.price),
                            item.category?.name,
                            item.quantity,
                        ]),
                    ],
                },
                layout: 'lightHorizontalLines',
            },
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                marginBottom: 15,
                alignment: 'center',
            },
            subheader: {
                fontSize: 16,
                bold: true,
                marginTop: 10,
                marginBottom: 10,
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'white',
                fillColor: '#4CAF50',
                alignment: 'center',
            },
            image: {
                margin: [0, 10, 0, 10],
                alignment: 'center',
            },
        },
        defaultStyle: {
            fontSize: 12,
            columnGap: 20,
        },
    };

    pdfMake.createPdf(docDefinition).open();
    // .download(`Livre_Restaurant_Report_${filterForm.dateRange}.pdf`);
}

onMounted(() => {
    createChart();
});
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
:deep(.mb-3) {
    margin-bottom: 0 !important;
}
:deep(.form-group) {
    margin-bottom: 10px;
}
</style>
