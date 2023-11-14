<template>
    <div class="content-wrapper row">
        <div class="col-md-4 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container working-hour">
                    <MoneyIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{ $t('dashboard.dashboard.statisticalData.revenueTotal') }}
                    </h5>
                    <span>{{ parseMoney(dashboardData.revenueTotal) }}</span>
                </div>
            </div>
        </div>

        <div class="col-md-4 timekeeping-card-container">
            <div class="timekeeping-info">
                <div class="icon-container working-hour">
                    <ListIcon class="icon" />
                </div>
                <div class="detail">
                    <h5 class="card-title">
                        {{ $t('dashboard.dashboard.statisticalData.billingCount') }}
                    </h5>
                    <span>{{ dashboardData.billingCount }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="content-wrapper">
        <RevenueChart />
    </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import RevenueChart from '../components/RevenueChart.vue';
import {
    Lock as LockIcon,
    Money as MoneyIcon,
    List as ListIcon,
} from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import { throttle } from 'lodash';
import { DateRangeTypes } from '../constant';
import { dashboardService } from '../services/api.services';
import { DATE_TIME_FORMAT } from '@/common/constants';
import moment from 'moment';
import { IDashboardData } from '../types';
import { UtilMixins } from '@/mixins/utilMixins';
@Options({
    components: { RevenueChart, LockIcon, MoneyIcon, ListIcon },
})
export default class DashboardPage extends mixins(UtilMixins) {
    throttled = throttle(this.createChart, 2000, { trailing: false });
    initData: IDashboardData = {
        billingCount: 0,
        revenueTotal: 0,
    };

    dashboardData = this.initData;

    async createChart() {
        const loading = ElLoading.service({
            target: '.support-request-category-chart',
        });

        const dateRanges = [
            moment(new Date())
                .startOf('month')
                .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            moment(new Date())
                .endOf('month')
                .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
        ];

        const response = await dashboardService.getDashboardData({
            dateRangeType: DateRangeTypes.MONTH,
            dateRanges,
        });

        if (response.success) {
            this.dashboardData = response.data;
        } else {
            this.dashboardData = this.initData;
        }
        loading.close();
    }

    async created() {
        await this.createChart();
    }
}
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
.timekeeping-card-container {
    padding-left: 10px !important;
    padding-right: 10px !important;
}
.timekeeping-info {
    padding: 20px 12px;
    border-radius: 10px;
    position: relative;
    display: flex;
    gap: 10px;
    text-align: left;
    background-color: $--color-gray-200;
    border: 1px solid rgba(0, 0, 0, 0.05);
    align-items: center;
    .icon-container {
        padding: 5px;
        border-radius: 10px;
        .icon {
            width: 32px;
            height: 32px;
        }
    }
    .detail {
        h5 {
            font-weight: 600;
        }
        span {
            font-weight: 500;
        }
    }
    @media only screen and (max-width: 1399.99px) {
        padding: 30px 12px;
    }
}

.working-hour {
    background-color: #e0e8f3;
    color: #1a55af;
}
</style>
