<template>
    <el-dialog
        width="80%"
        v-model="isShowSetupTableOfBookingPopup"
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
        <TableDiagram />
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center footer">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button
                            plain
                            el-button
                            type="info"
                            class="modal-button"
                            @click="closeModal"
                            ><div class="text-btn">Hủy</div></el-button
                        >
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            type="danger"
                            plain
                            class="modal-button"
                            @click="sendData()"
                            ><div class="text-btn">Lưu</div></el-button
                        >
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
import { mixins, Options } from 'vue-property-decorator';
import TableDiagram from '../../table-diagram/components/TableDiagram.vue';
import { HttpStatus } from '@/common/constants';
import { bookingService } from '@/modules/table-diagram/services/api.service';
import { tableDiagramModule } from '@/modules/table-diagram/store';
import {
    showSuccessNotificationFunction,
    showErrorNotificationFunction,
} from '@/utils/helper';
import { ElLoading, ElMessageBox } from 'element-plus';
import { LIMIT_ARRIVAL_TIME_BOOKING } from '@/modules/table-diagram/constants';
import moment from 'moment';
import { ITable } from '@/modules/table-diagram/types';
import { IBookingUpdate } from '../types';
import { TableMixins } from '@/modules/table-diagram/mixins';

@Options({
    name: 'booking-form-popup',
    components: {
        TableDiagram,
    },
})
export default class SetupTableOfBookingPopup extends mixins(TableMixins) {
    get isShowSetupTableOfBookingPopup(): boolean {
        return bookingModule.isShowSetupTableOfBookingPopup || false;
    }

    set isShowSetupTableOfBookingPopup(val: boolean) {
        bookingModule.setIsShowSetupTableOfBookingPopup(val);
    }

    get tableSelected(): ITable | null {
        return tableDiagramModule.tableSelected;
    }

    get selectedBooking(): IBookingUpdate | null {
        return bookingModule.selectedBooking;
    }

    form = setup(() => initData());

    async closePopup(): Promise<void> {
        bookingModule.setIsShowSetupTableOfBookingPopup(false);
        bookingModule.setSelectedBooking(null);
        (this.form.resetForm as () => void)();
    }

    async sendData(): Promise<void> {
        if (!this.tableSelected) return;
        const canContinue = await this.checkCanSelectTable(
            this.tableSelected,
            this.selectedBooking?.numberPeople,
            new Date(this.selectedBooking?.arrivalTime ?? new Date()),
        );
        if (!canContinue) return;

        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await bookingService.update(
            bookingModule.selectedBooking?.id as number,
            {
                tableId: tableDiagramModule.tableSelected?.id,
            },
        );
        loading.close();

        if (response.success) {
            const loading = ElLoading.service({
                target: '.content',
            });
            showSuccessNotificationFunction('Cập nhật bàn thành công');
            await bookingModule.getBookings();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                const loading = ElLoading.service({
                    target: '.content',
                });
                await bookingModule.getBookings();
                loading.close();
            }
        }
        this.closePopup();
    }

    checkTimeBooking(oldTime: Date, newTime: Date): boolean {
        if (
            Math.abs(new Date(oldTime).getTime() - new Date(newTime).getTime()) <
            LIMIT_ARRIVAL_TIME_BOOKING
        ) {
            const textWarning = `Bàn bạn vừa chọn đã bị đặt chỗ từ trước. Khách hàng sẽ đến vào lúc ${moment(
                oldTime,
            ).fmFullTimeWithoutSecond()}, Vui lòng chọn bàn khác!`;
            ElMessageBox.alert(textWarning, 'Warning', {
                confirmButtonText: 'OK',
            });
            return true;
        }
        return false;
    }

    checkNumberSeat(numberPeople: number, numberSeat: number): boolean {
        if (numberPeople > numberSeat) {
            const textWarning = `Yêu cầu đặt bàn có ${numberPeople} chỗ. Bàn bạn vừa chọn chỉ có ${numberSeat} chỗ. Vui lòng chọn bàn khác!`;
            ElMessageBox.alert(textWarning, 'Warning', {
                confirmButtonText: 'OK',
            });
            return false;
        }
        return true;
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
