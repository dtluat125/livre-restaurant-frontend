<template>
    <el-dialog
        width="80%"
        v-model="isShowReportRevenueFormPopUp"
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="report-revenue-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    checkIsShiftLeaderOfReportRevenue
                        ? $t('reportRevenue.reportRevenue.updateTitle')
                        : $t('reportRevenue.reportRevenue.createTitle')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-2">
                <BaseInputText
                    class="readonly-input-text"
                    :value="parseDateTime(selectedReportRevenue.date, YYYY_MM_DD_HYPHEN)"
                    :isReadonly="true"
                    :label="$t('reportRevenue.reportRevenue.reportRevenueForm.date')"
                />
            </div>
            <div class="col-md-2">
                <BaseInputText
                    class="readonly-input-text"
                    :value="fullNameShiftLeader"
                    :isReadonly="true"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.shiftLeader')
                    "
                />
            </div>
            <div class="col-md-2">
                <BaseInputText
                    class="readonly-input-text"
                    :value="
                        $t(
                            `reportRevenue.reportRevenue.shiftWork.${selectedReportRevenue.shift}`,
                        )
                    "
                    :isReadonly="true"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.shiftLeader')
                    "
                />
            </div>
            <div class="col-md-2">
                <BaseInputText
                    class="readonly-input-text"
                    :value="selectedReportRevenue.billingCount"
                    :isReadonly="true"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.billingCount')
                    "
                />
            </div>
            <div class="col-md-4">
                <BaseInputText
                    v-model:value="form.note"
                    :class="isApproved ? 'readonly-input-text' : ''"
                    :isReadonly="isApproved"
                    :error="translateYupError(form.errors.note)"
                    :label="$t('reportRevenue.reportRevenue.reportRevenueForm.note')"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.input') }}
                </h3>
                <BaseInputNumber
                    name="cashAtBeginningOfShift"
                    is-required="true"
                    :class="isApproved ? 'readonly-input-text' : ''"
                    :isReadonly="isApproved"
                    v-model:value="form.cashAtBeginningOfShift"
                    :label="
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.cashAtBeginningOfShift',
                        )
                    "
                    :placeholder="
                        !isApproved
                            ? $t(
                                  'reportRevenue.reportRevenue.placeholder.cashAtBeginningOfShift',
                              )
                            : ''
                    "
                    :error="translateYupError(form.errors.cashAtBeginningOfShift)"
                />
                <BaseInputText
                    name="billingRevenue"
                    is-required="true"
                    class="readonly-input-text"
                    :value="parseMoney(form.billingRevenue)"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.billingRevenue')
                    "
                    :error="translateYupError(form.errors.billingRevenue)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.output') }}
                </h3>
                <BaseInputNumber
                    name="cashAtEndingOfShift"
                    is-required="true"
                    v-model:value="form.cashAtEndingOfShift"
                    :class="isApproved ? 'readonly-input-text' : ''"
                    :isReadonly="isApproved"
                    :label="
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.cashAtEndingOfShift',
                        )
                    "
                    :placeholder="
                        !isApproved
                            ? $t(
                                  'reportRevenue.reportRevenue.placeholder.cashAtEndingOfShift',
                              )
                            : ''
                    "
                    :error="translateYupError(form.errors.cashAtEndingOfShift)"
                />
                <BaseInputNumber
                    name="bankingRevenue"
                    is-required="true"
                    v-model:value="form.bankingRevenue"
                    :class="isApproved ? 'readonly-input-text' : ''"
                    :isReadonly="isApproved"
                    :label="
                        $t('reportRevenue.reportRevenue.reportRevenueForm.bankingRevenue')
                    "
                    :placeholder="
                        !isApproved
                            ? $t('reportRevenue.reportRevenue.placeholder.bankingRevenue')
                            : ''
                    "
                    :error="translateYupError(form.errors.bankingRevenue)"
                />
            </div>
            <div class="col-md-6">
                <h3>
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.totalInput') }}
                </h3>
                <h3>{{ parseMoney(calculateTotalInput) }}</h3>
            </div>

            <div class="col-md-6">
                <h3 class="mb-3">
                    {{ $t('reportRevenue.reportRevenue.reportRevenueForm.totalOutput') }}
                </h3>
                <h3>{{ parseMoney(calculateTotalOutput) }}</h3>
            </div>
            <div
                class="col-md-12"
                :class="calculateDifference < 0 ? 'text-danger' : 'text-info'"
            >
                <h3 class="mb-3">
                    {{
                        $t(
                            'reportRevenue.reportRevenue.reportRevenueForm.differenceRevenue',
                        )
                    }}
                </h3>
                <h3>
                    {{ parseMoney(Math.abs(calculateDifference)) }}
                </h3>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="onClickCancel">
                            {{ $t('reportRevenue.reportRevenue.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            :disabled="isDisabledSaveButton"
                            v-if="checkIsShiftLeaderOfReportRevenue"
                            type="primary"
                            @click="onClickSaveButton()"
                        >
                            {{ $t('reportRevenue.reportRevenue.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '../composition/reportRevenue';
import { setup } from 'vue-class-component';
import { reportRevenueModule } from '../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { ISelectOptions } from '@/common/types';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { SHIFT_OPTIONS } from '../constants';
import { appService } from '@/utils/app';
import { IReportRevenueUpdateBody } from '../types';
import { AcceptStatus } from '@/common/constants';

export default class ReportRevenueFormPopup extends UtilMixins {
    get selectedReportRevenue(): IReportRevenueUpdateBody | null {
        return reportRevenueModule.selectedReportRevenue;
    }

    get shiftOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(SHIFT_OPTIONS);
    }

    get checkIsShiftLeaderOfReportRevenue(): boolean {
        if (this.selectedReportRevenue?.status === AcceptStatus.APPROVE) {
            return false;
        }

        if (!reportRevenueModule.selectedReportRevenue?.shiftLeaderId) {
            return true;
        }
        if (
            reportRevenueModule.selectedReportRevenue?.shiftLeaderId ===
            appService.getUser().id
        ) {
            return true;
        }
        return false;
    }

    get isApproved(): boolean {
        return this.selectedReportRevenue?.status === AcceptStatus.APPROVE;
    }

    form = setup(() => initData());

    get isDisabledSaveButton(): boolean {
        return reportRevenueModule.isDisabledSaveButton;
    }

    get isShowReportRevenueFormPopUp(): boolean {
        return reportRevenueModule.isShowReportRevenueFormPopUp || false;
    }

    set isShowReportRevenueFormPopUp(val: boolean) {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(val);
    }

    get fullNameShiftLeader(): string | undefined {
        return this.selectedReportRevenue?.shiftLeaderId
            ? this.selectedReportRevenue?.shiftLeader?.fullName
            : appService.getUser().fullName;
    }

    get calculateTotalInput(): number {
        return (
            parseFloat(this.form.cashAtBeginningOfShift as string) ||
            0 + parseFloat(this.form.billingRevenue as string) ||
            0
        );
    }

    get calculateTotalOutput(): number {
        return (
            parseFloat(this.form.cashAtEndingOfShift as string) ||
            0 + parseFloat(this.form.bankingRevenue as string) ||
            0
        );
    }

    get calculateDifference(): number {
        const diff = this.calculateTotalOutput - this.calculateTotalInput || 0;
        this.form.differenceRevenue = diff;
        return diff;
    }

    onClickCancel(): void {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
    }

    async closePopup(): Promise<void> {
        reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
        reportRevenueModule.setSelectedReportRevenue(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        reportRevenueModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        reportRevenueModule.setIsDisabledSaveButton(false);
    }
}
</script>
<style lang="scss" scoped>
@media (max-width: 1199.98px) {
    :deep(.el-dialog) {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}
.font-weight-bold {
    font-weight: 700;
}
.price-text {
    width: fit-content;
    border-top: 1px solid rgb(126, 126, 126);
}
.readonly-input-text {
    :deep(.el-input__inner) {
        box-shadow: none;
    }
}
.text-danger {
    :deep(.el-input__inner) {
        font-weight: 700;
        color: red;
    }
}
.text-info {
    :deep(.el-input__inner) {
        font-weight: 700;
        color: blue;
    }
}
</style>
