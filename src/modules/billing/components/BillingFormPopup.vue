<template>
    <el-dialog
        width="80%"
        v-model="isShowBillingFormPopUp"
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="billing-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    selectedBilling.billingStatus === BillingStatus.PAID
                        ? $t('billing.billing.detailTitle')
                        : $t('billing.billing.updateTitle')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-4">
                <BaseInputText
                    class="readonly-input-text"
                    v-model:value="form.paymentTime"
                    :error="translateYupError(form.errors.paymentTime)"
                    :isReadonly="true"
                    :label="$t('billing.billing.billingForm.paymentTime')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputText
                    class="readonly-input-text"
                    v-model:value="form.cashier"
                    :error="translateYupError(form.errors.cashier)"
                    :isReadonly="true"
                    :label="$t('billing.billing.billingForm.cashier')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputText
                    :class="!checkBillingWaitForPay ? 'readonly-input-text' : ''"
                    v-model:value="form.note"
                    :error="translateYupError(form.errors.note)"
                    :isReadonly="!checkBillingWaitForPay"
                    :label="$t('billing.billing.billingForm.note')"
                    :placeholder="$t('billing.billing.placeholder.note')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputText
                    :class="!checkBillingWaitForPay ? 'readonly-input-text' : ''"
                    v-model:value="form.customerName"
                    :error="translateYupError(form.errors.nameCustomer)"
                    :isReadonly="!checkBillingWaitForPay"
                    :label="$t('billing.billing.billingForm.nameCustomer')"
                    :placeholder="$t('billing.billing.placeholder.nameCustomer')"
                />
            </div>
            <div class="col-md-4">
                <BaseInputNumber
                    :class="!checkBillingWaitForPay ? 'readonly-input-text' : ''"
                    name="phone"
                    v-model:value="form.customerPhone"
                    :isReadonly="!checkBillingWaitForPay"
                    :label="$t('billing.billing.billingForm.phone')"
                    :placeholder="$t('billing.billing.placeholder.phone')"
                    :error="translateYupError(form.errors.phone)"
                />
            </div>
            <div class="col-md-4">
                <BaseSingleSelect
                    v-model:value="form.paymentMethod"
                    :filterable="true"
                    :options="paymentMethodOptions"
                    :is-required="true"
                    :isDisabled="!checkBillingWaitForPay"
                    :error="translateYupError(form.errors.paymentMethod)"
                    :label="$t('billing.billing.billingForm.paymentMethod')"
                />
            </div>
            <div class="col-md-12 mb-3">
                <FoodBillingTable />
            </div>
            <div class="col-md-10 text-end font-weight-bold">
                {{ $t('billing.billing.billingForm.total') }}
            </div>
            <div class="col-md-2 text-end">
                {{ parseMoney(totalFoodPrice) }}
            </div>
            <div class="col-md-10 text-end font-weight-bold">
                {{ $t('billing.billing.billingForm.vat') }}
            </div>
            <div class="col-md-2 text-end">+&nbsp;{{ parseMoney(vat) }}</div>
            <div class="col-md-10 text-end font-weight-bold">
                {{ $t('billing.billing.billingForm.promotion') }}
            </div>
            <div class="col-md-2 text-end">-&nbsp;{{ parseMoney(promotionBilling) }}</div>
            <div class="col-md-10 text-end mt-2 pt-2 font-weight-bold">
                {{ $t('billing.billing.billingForm.totalBillingPrice') }}
            </div>
            <div class="col-md-2 d-flex mt-2 justify-content-end">
                <div class="price-text pt-2">{{ parseMoney(totalBillingPrice) }}</div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="onClickCancel">
                            {{ $t('billing.billing.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            type="primary"
                            @click="onClickSaveButton()"
                            v-if="!!checkBillingWaitForPay"
                        >
                            {{ $t('billing.billing.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { initData } from '../composition/billingForm';
import { Options, setup } from 'vue-class-component';
import { billingModule } from '../store';
import { ISelectOptions } from '@/common/types';
import { UtilMixins } from '@/mixins/utilMixins';
import FoodBillingTable from '../components/FoodBillingTable.vue';
import { parseLanguageSelectOptions } from '@/utils/helper';
import { BillingStatus, IBillingUpdate } from '../types';

@Options({
    components: { FoodBillingTable },
})
export default class BillingFormPopup extends UtilMixins {
    get checkBillingWaitForPay(): boolean {
        return (
            billingModule.selectedBilling?.billingStatus === BillingStatus.WAIT_FOR_PAY
        );
    }

    get selectedBilling(): IBillingUpdate | null {
        return billingModule.selectedBilling;
    }

    get statusBillingOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(this.BillingStatusOptions);
    }

    get paymentMethodOptions(): ISelectOptions[] {
        return parseLanguageSelectOptions(this.PaymentMethodOptions);
    }

    form = setup(() => initData());

    get totalFoodPrice(): number {
        return billingModule.selectedBilling?.paymentTotal || 0;
    }

    get vat(): number {
        return this.calculateVAT(this.totalFoodPrice);
    }

    get promotionBilling(): number {
        return 0;
    }

    get totalBillingPrice(): number {
        billingModule.setPaymentTotal(this.calculatePriceIncludeTax(this.totalFoodPrice));
        return this.calculatePriceIncludeTax(this.totalFoodPrice);
    }

    get isShowBillingFormPopUp(): boolean {
        return billingModule.isShowBillingFormPopUp || false;
    }

    set isShowBillingFormPopUp(val: boolean) {
        billingModule.setIsShowBillingFormPopUp(val);
    }

    onClickCancel(): void {
        billingModule.setIsShowBillingFormPopUp(false);
    }

    async closePopup(): Promise<void> {
        billingModule.setIsShowBillingFormPopUp(false);
        billingModule.setSelectedBilling(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        await this.form.onSubmit();
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
</style>
