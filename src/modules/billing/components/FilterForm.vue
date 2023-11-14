<template>
    <BaseFilterFormLayout
        :isToggleFilterForm="isToggleFilterForm"
        @search="handleFilter"
        @reset="resetFilter"
        @keyup.enter="handleFilter"
    >
        <template #filter-title>
            <h5 class="filter-title">
                {{ $t('common.app.filterForm.search') }}
            </h5>
        </template>
        <slot>
            <div class="action-group">
                <div class="row">
                    <div class="col-xl-4 col-md-4 col-12">
                        <BaseInputText
                            v-model:value="filterForm.keyword"
                            :label="$t('billing.billing.filterForm.keyword.label')"
                            :placeholder="
                                $t('billing.billing.filterForm.keyword.placeholder')
                            "
                            size="default"
                        />
                    </div>
                    <div class="col-xl-4 col-md-4 col-12">
                        <label
                            class="text-start w-100 fw-bold"
                            style="margin-bottom: 8px"
                            >{{
                                $t('billing.billing.filterForm.paymentDateRange.label')
                            }}</label
                        >
                        <el-date-picker
                            v-model="paymentTimeRange"
                            type="daterange"
                            unlink-panels
                            size="medium"
                            :range-separator="
                                $t('billing.billing.filterForm.paymentDateRange.to')
                            "
                            :start-placeholder="
                                $t(
                                    'billing.billing.filterForm.paymentDateRange.startDate',
                                )
                            "
                            :end-placeholder="
                                $t('billing.billing.filterForm.paymentDateRange.endDate')
                            "
                        />
                    </div>
                </div>
            </div>
        </slot>
    </BaseFilterFormLayout>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { DEFAULT_FIRST_PAGE, LIMIT_PER_PAGE } from '@/common/constants';
import { Prop, Watch } from 'vue-property-decorator';
import { ElLoading } from 'element-plus';
import { billingModule } from '../store';
import { IQueryStringBilling } from '../types';
import moment from 'moment';
export default class FilterForm extends Vue {
    @Prop({ default: false }) readonly isToggleFilterForm!: boolean;
    @Prop({ default: '0' }) readonly currentTab!: string;
    filterForm = {
        keyword: '',
        payerIds: [],
    };

    paymentTimeRange = [];

    async resetFilter(): Promise<void> {
        this.filterForm = {
            keyword: '',
            payerIds: [],
        };
        this.paymentTimeRange = [];
        billingModule.clearBillingQueryString();
        await this.handleFilter();
    }

    async handleFilter(): Promise<void> {
        const query: IQueryStringBilling = {
            page: DEFAULT_FIRST_PAGE,
            limit: LIMIT_PER_PAGE,
            keyword: this.filterForm.keyword.trim()?.length
                ? this.filterForm.keyword?.trim()
                : undefined,
            payerIds: this.filterForm.payerIds,
            paymentTimeRange: this.paymentTimeRange
                ? (this.paymentTimeRange as Date[]).map((date: Date) =>
                      moment(date).utc().fmFullTimeString(),
                  )
                : null,
        };
        billingModule.setBillingQueryString(query);
        const loading = ElLoading.service({
            target: '.content',
        });
        await billingModule.getBillingList();
        loading.close();
    }

    @Watch('currentTab')
    tabChange(): void {
        this.filterForm = {
            keyword: '',
            payerIds: [],
        };
    }
}
</script>

<style lang="scss" scoped>
.filter-title {
    font-weight: bold;
    margin-bottom: 8px;
}
.el-input-group {
    margin-top: 30px;
}
.el-button {
    width: 120px;
}
.el-button--default {
    width: 50px;
}
.cp-button {
    margin-left: 10px;
    .el-button {
        width: 120px;
    }
}
:deep(.form-group) {
    margin-bottom: 0 !important;
}
:deep(label) {
    font-size: 13px;
}
</style>
