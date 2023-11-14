<template>
    <el-dialog
        width="80%"
        v-model="isShowBookingFormPopUp"
        destroy-on-close
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="booking-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    form.isCreate
                        ? $t('booking.booking.bookingDialog.titleCreate')
                        : $t('booking.booking.bookingDialog.titleUpdate')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.nameCustomer"
                    :placeholder="$t('booking.booking.placeholder.nameCustomer')"
                    :label="$t('booking.booking.bookingDialog.nameCustomer')"
                    :error="translateYupError(form.errors.nameCustomer)"
                />
            </div>
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.phone"
                    :error="translateYupError(form.errors.phone)"
                    :label="$t('booking.booking.bookingDialog.phone')"
                    :placeholder="$t('booking.booking.placeholder.phone')"
                />
            </div>
            <div class="col-md-6">
                <BaseInputNumber
                    v-model:value="form.numberPeople"
                    :is-required="true"
                    :placeholder="$t('booking.booking.placeholder.numberPeople')"
                    :label="$t('booking.booking.bookingDialog.numberPeople')"
                    :error="translateYupError(form.errors.numberPeople)"
                    @change="setNumberPeople"
                />
            </div>
            <div class="col-md-6">
                <BaseDatePicker
                    v-model:value="form.arrivalTime"
                    :placeholder="$t('booking.booking.placeholder.arrivalTime')"
                    :label="$t('booking.booking.bookingDialog.arrivalTime')"
                    :error="translateYupError(form.errors.arrivalTime)"
                    :is-required="true"
                    :min-date="new Date()"
                    :default-value="minEndDate"
                    :type="'datetime'"
                    :date-format="YYYY_MM_DD_HYPHEN_HH_MM_COLON"
                    :value-format="YYYY_MM_DD_HYPHEN_HH_MM_COLON"
                />
            </div>
        </div>
        <TableDiagram />
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center footer">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="closePopup">
                            {{ $t('booking.booking.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            type="primary"
                            @click="onClickSaveButton"
                            :disabled="isDisabledSaveButton"
                        >
                            {{ $t('booking.booking.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { setup } from 'vue-class-component';
import { initData } from '../composition/createForm';
import { bookingModule } from '../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins, Options } from 'vue-property-decorator';
import TableDiagram from '../../table-diagram/components/TableDiagram.vue';
import { tableDiagramModule } from '@/modules/table-diagram/store';
@Options({
    name: 'booking-form-popup',
    components: {
        TableDiagram,
    },
})
export default class BookingFormPopUp extends mixins(UtilMixins) {
    get isDisabledSaveButton(): boolean {
        return bookingModule.isDisabledSaveButton;
    }

    get isShowBookingFormPopUp(): boolean {
        return bookingModule.isShowBookingFormPopUp || false;
    }

    set isShowBookingFormPopUp(val: boolean) {
        bookingModule.setIsShowBookingFormPopUp(val);
    }

    form = setup(() => initData());

    async closePopup(): Promise<void> {
        bookingModule.setIsShowBookingFormPopUp(false);
        bookingModule.setSelectedBooking(null);
        tableDiagramModule.setTableSelected(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        bookingModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        bookingModule.setSelectedBooking(null);
        bookingModule.setIsDisabledSaveButton(false);
    }

    setNumberPeople(): void {
        bookingModule.setSelectedBooking({
            ...bookingModule.selectedBooking,
            id: undefined,
            numberPeople: this.form.numberPeople as number,
        });
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

:deep(.el-input-number .el-input__inner) {
    width: 100%;
    margin-bottom: 15px;
    height: 36px !important;
}
</style>
