<script setup lang="ts">
import { parseMoney } from '@/utils/util';
import { List as ListIcon, Money as MoneyIcon } from '@element-plus/icons-vue';
import { IDashboardData } from '../types';

defineProps<{ dashboardData: IDashboardData }>();
</script>
<template>
    <div class="">
        <div class="row mt-3">
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
    </div>
</template>

<style scoped lang="scss">
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
