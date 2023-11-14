<template>
    <div class="row support-request-category-chart">
        <div class="col-4">
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
                            filterForm.dateRangeType === dateRangeTypes.MONTH
                                ? 'year'
                                : 'month'
                        "
                        :dateFormat="
                            filterForm.dateRangeType === dateRangeTypes.MONTH
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
        <div class="col-8">
            <canvas ref="statChart"></canvas>
        </div>
    </div>
</template>
<script lang="ts">
import { Chart, ChartItem, registerables } from 'chart.js';
import { mixins } from 'vue-class-component';
import { IRevenueChart } from '../types';
import { dashboardService } from '../services/api.services';

import { DateRangeTypeOptions, DateRangeTypes, DAY_PER_MONTH, Months } from '../constant';
import { DATE_TIME_FORMAT } from '@/common/constants';
import { DashboardMixins } from '../mixin';
import moment from 'moment';
import { ISelectOptions } from '@/common/types';
import { ElLoading } from 'element-plus';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { throttle } from 'lodash';

Chart.register(...registerables);

export default class RevenueChart extends mixins(DashboardMixins) {
    filterForm: Record<string, string> = {
        dateRangeType: DateRangeTypes.MONTH,
        dateRange: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
    };

    chart: Chart | null = null;
    supportRequestCategoryCount: IRevenueChart[] = [];
    throttled = throttle(this.createChart, 2000, { trailing: false });

    get dateRangeTypeOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(DateRangeTypeOptions);
    }

    get datasets() {
        const revenue: number[] = [];
        if (this.filterForm.dateRangeType === DateRangeTypes.MONTH) {
            Months.forEach((month) => {
                const userTime = this.supportRequestCategoryCount.find(
                    (userTimeByModule) => {
                        console.log(userTimeByModule.month, month.value);

                        return userTimeByModule.month === month.value;
                    },
                );
                if (userTime) {
                    revenue.push(userTime.revenue);
                } else {
                    revenue.push(0);
                }
            });
        } else {
            [...Array(DAY_PER_MONTH).keys()].forEach((day) => {
                const userTime = this.supportRequestCategoryCount.find(
                    (userTimeByModule) => userTimeByModule.day === day,
                );
                if (userTime) {
                    revenue.push(userTime.revenue);
                } else {
                    revenue.push(0);
                }
            });
        }
        return [
            {
                label: this.$t('dashboard.dashboard.StatisticalChart.chart.revenue.line'),
                data: revenue,
                borderColor: '#ED1C24',
                backgroundColor: `rgba(237, 28, 36, 0.3)`,
                fill: 1,
            },
        ];
    }

    async createChart() {
        const loading = ElLoading.service({
            target: '.support-request-category-chart',
        });
        await this.getSupportRequestCategoryCount();
        if (this.chart) {
            (this.chart as Chart).destroy();
        }
        this.chart = new Chart(this.$refs.statChart as ChartItem, {
            type: 'line',
            data: {
                labels:
                    this.filterForm.dateRangeType === DateRangeTypes.MONTH
                        ? Months.map((month) => this.$t(month.label))
                        : [...Array(DAY_PER_MONTH).keys()].map((day) => day.toString()),
                datasets: this.datasets,
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
                        text: this.$t(
                            'dashboard.dashboard.StatisticalChart.chart.revenue.label',
                        ),
                    },
                },
                interaction: {
                    intersect: false,
                },
            },
        });
        loading.close();
    }

    async getSupportRequestCategoryCount() {
        const dateRanges = [];
        if (this.filterForm.dateRange?.length) {
            if (this.filterForm.dateRangeType === DateRangeTypes.MONTH) {
                dateRanges.push(
                    moment(this.filterForm.dateRange)
                        .startOf('year')
                        .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
                );
                dateRanges.push(
                    moment(this.filterForm.dateRange)
                        .endOf('year')
                        .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
                );
            } else {
                dateRanges.push(
                    moment(this.filterForm.dateRange)
                        .startOf('month')
                        .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
                );
                dateRanges.push(
                    moment(this.filterForm.dateRange)
                        .endOf('month')
                        .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
                );
            }
        }
        const response = await dashboardService.getRevenueChartData({
            dateRangeType: this.filterForm.dateRangeType || DateRangeTypes.MONTH,
            dateRanges,
        });
        if (response.success) {
            this.supportRequestCategoryCount = response.data.items;
        } else {
            this.supportRequestCategoryCount = [];
        }
    }

    async created() {
        await this.createChart();
    }

    async handleFilter(): Promise<void> {
        await this.throttled();
    }

    async resetFilter(): Promise<void> {
        this.filterForm = {
            dateRangeType: DateRangeTypes.MONTH,
            dateRange: moment().format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
        };
        await this.throttled();
    }
}
</script>
