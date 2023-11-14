<template>
    <el-card class="login-form">
        <h5 class="title">{{ $t('common.app.bookTablePage') }}</h5>
        <img class="logo" src="@/assets/images/logo/logo-horizontal.svg" alt="" />

        <div class="row">
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.nameCustomer"
                    :is-required="true"
                    :placeholder="$t('booking.booking.placeholder.nameCustomer')"
                    :label="$t('booking.booking.bookingDialog.nameCustomer')"
                    :error="translateYupError(form.errors.nameCustomer)"
                />
            </div>
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.phone"
                    :is-required="true"
                    :error="translateYupError(form.errors.phone)"
                    :label="$t('booking.booking.bookingDialog.phone')"
                    :placeholder="$t('booking.booking.placeholder.phone')"
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
        </div>
        <TableDiagram v-if="form.numberPeople" />
        <div class="mt-5 d-flex justify-content-center">
            <el-button
                type="primary"
                @click="onClickSaveButton"
                :disabled="isDisabledSaveButton"
            >
                {{ $t('booking.booking.button.submit') }}
            </el-button>
        </div>
    </el-card>
</template>

<script lang="ts">
import { Options, setup, mixins } from 'vue-class-component';
import TableDiagram from '../modules/table-diagram/components/TableDiagram.vue';
import { initData } from '../modules/booking/composition/createForm';
import { bookingModule } from '@/modules/booking/store';
import { tableDiagramModule } from '@/modules/table-diagram/store';
import { UtilMixins } from '@/mixins/utilMixins';
import { appModule } from '@/store/app';

@Options({
    components: {
        TableDiagram,
    },
})
export default class GuestLayout extends mixins(UtilMixins) {
    form = setup(() => initData());

    async onClickSaveButton(): Promise<void> {
        bookingModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        bookingModule.setSelectedBooking(null);
        bookingModule.setIsDisabledSaveButton(false);
    }

    beforeDestroy(): void {
        appModule.mutateIsGuestPage(false);
        bookingModule.setIsShowBookingFormPopUp(false);
        bookingModule.setSelectedBooking(null);
        tableDiagramModule.setTableSelected(null);
        (this.form.resetForm as () => void)();
    }

    created(): void {
        appModule.mutateIsGuestPage(true);
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
.action-link {
    text-decoration: none;
}
.input-email {
    margin-bottom: 35px !important;
}
.login-form {
    width: 70%;
    border-radius: 12px;
    margin: 50px auto;
}
.btn-action {
    border-radius: 10px;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    height: 40px;
    transition: all 0.15s ease-in;
    &:hover {
        color: #fff !important;
        transform: scale(1.02);
    }
}

:deep(.el-input) {
    height: 40px;
}
:deep(.form-group) {
    margin: 20px 0;
}
.title {
    font-weight: 600;
    margin-bottom: 20px;
    font-size: 25px;
}
.logo {
    width: 100px;
}
.bg-sign-in {
    background-image: linear-gradient(310deg, #2152ff 0%, #21d4fd 100%);
}

.bg-sign-in-ldap {
    display: flex;
    background-color: #fff;
    color: #000;
    &:hover {
        color: #000 !important;
        transform: scale(1.02);
    }
}

.bg-sign-up {
    background-image: linear-gradient(310deg, #141727 0%, #3a416f 100%);
}

.text-border:after,
.text-border:before {
    content: '';
    display: inline-block;
    width: 30%;
    height: 1px;
    position: relative;
    vertical-align: middle;
}

.text-border:after {
    background: linear-gradient(
        90deg,
        rgba(117, 117, 117, 0.4),
        rgba(117, 117, 117, 0.4),
        transparent
    );
}

.text-border:before {
    background: linear-gradient(
        90deg,
        transparent,
        rgba(117, 117, 117, 0.4),
        rgba(117, 117, 117, 0.4)
    );
}

.text-border:before {
    right: 0.5em;
    margin-left: -50%;
}

.text-border:after {
    left: 0.5em;
    margin-right: -50%;
}

.forgot-password-btn {
    display: flex;
    justify-content: end;
    margin-top: -21px;
    font-size: 14px;
    color: blue;
    text-decoration-line: underline;
    cursor: pointer;
}
</style>
