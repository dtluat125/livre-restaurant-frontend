<template>
    <div class="row support-request-category-chart">
        <div class="col-12">
            <canvas id="chart" ref="statChart"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { DATE_TIME_FORMAT } from '@/common/constants';
import { Chart, ChartItem, registerables } from 'chart.js';
import { ElLoading } from 'element-plus';
import { throttle } from 'lodash';
import moment from 'moment';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { DateRangeTypes, DAY_PER_MONTH, Months } from '../constant';
import { dashboardService } from '../services/api.services';
import { IRevenueChart } from '../types';

Chart.register(...registerables);

const { t } = useI18n();

const props = defineProps<{ filterForm: any }>();

const chart = ref<Chart | null>(null);
const supportRequestCategoryCount = ref<IRevenueChart[]>([]);
const statChart = ref<HTMLElement | null>(null);

const throttledCreateChart = throttle(createChart, 2000, { trailing: false });

const datasets = ref(() => {
    const revenue: number[] = [];
    if (props.filterForm.dateRangeType === DateRangeTypes.MONTH) {
        Months.forEach((month) => {
            const userTime = supportRequestCategoryCount.value.find(
                (userTimeByModule) => userTimeByModule.month === month.value,
            );
            revenue.push(userTime ? userTime.revenue : 0);
        });
    } else {
        [...Array(DAY_PER_MONTH).keys()].forEach((day) => {
            const userTime = supportRequestCategoryCount.value.find(
                (userTimeByModule) => userTimeByModule.day === day,
            );
            revenue.push(userTime ? userTime.revenue : 0);
        });
    }
    return [
        {
            label: t('dashboard.dashboard.StatisticalChart.chart.revenue.line'),
            data: revenue,
            borderColor: '#ED1C24',
            backgroundColor: `rgba(237, 28, 36, 0.3)`,
            fill: 1,
        },
    ];
});

async function createChart() {
    const loading = ElLoading.service({
        target: '.support-request-category-chart',
    });
    await getSupportRequestCategoryCount();
    if (chart.value) {
        chart.value.destroy();
    }
    chart.value = new Chart(statChart.value as ChartItem, {
        type: 'line',
        data: {
            labels:
                props.filterForm.dateRangeType === DateRangeTypes.MONTH
                    ? Months.map((month) => t(month.label))
                    : [...Array(DAY_PER_MONTH).keys()].map((day) => day.toString()),
            datasets: datasets.value(),
        },
        options: {
            scales: {
                y: {
                    stacked: true,
                },
            },
            plugins: {
                filler: {
                    propagate: false,
                },
                title: {
                    display: true,
                    text: t('dashboard.dashboard.StatisticalChart.chart.revenue.label'),
                },
            },
            interaction: {
                intersect: false,
            },
        },
    });
    loading.close();
}

async function getSupportRequestCategoryCount() {
    const dateRanges: string[] = [];
    if (props.filterForm.dateRange?.length) {
        if (props.filterForm.dateRangeType === DateRangeTypes.MONTH) {
            dateRanges.push(
                moment(props.filterForm.dateRange)
                    .startOf('year')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
            dateRanges.push(
                moment(props.filterForm.dateRange)
                    .endOf('year')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
        } else {
            dateRanges.push(
                moment(props.filterForm.dateRange)
                    .startOf('month')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
            dateRanges.push(
                moment(props.filterForm.dateRange)
                    .endOf('month')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
        }
    }
    const response = await dashboardService.getRevenueChartData({
        dateRangeType: props.filterForm.dateRangeType || DateRangeTypes.MONTH,
        dateRanges,
    });
    supportRequestCategoryCount.value = response.success ? response.data.items : [];
}

async function handleFilter() {
    await throttledCreateChart();
}

onMounted(() => {
    createChart();
});

watch(props.filterForm, async () => {
    await handleFilter();
});
</script>
