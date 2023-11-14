import { ITable } from './types';
import { HttpStatus } from '@/common/constants';
import { UtilMixins } from '@/mixins/utilMixins';
import {
    showSuccessNotificationFunction,
    showErrorNotificationFunction,
} from '@/utils/helper';
import { ElLoading, ElMessageBox } from 'element-plus';
import { mixins } from 'vue-property-decorator';
import { bookingModule } from '../booking/store';
import { LIMIT_ARRIVAL_TIME_BOOKING, TableStatus, FloorRestaurant } from './constants';
import { tableService } from './services/api.service';
import { tableDiagramModule } from './store';
import { bookingService } from '../booking/services/api.service';
import moment from 'moment';

export class TableMixins extends mixins(UtilMixins) {
    // Common variable
    TableStatus = TableStatus;
    FloorRestaurant = FloorRestaurant;
    // Common function
    async updateTableStatus(table: ITable, status: TableStatus): Promise<void> {
        if (status === TableStatus.USED) {
            const canContinue = await this.checkCanSelectTable(table);
            if (!canContinue) return;
        }
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = await tableService.update(table.id, {
            status: status,
        });
        loading.close();
        if (response.success) {
            showSuccessNotificationFunction('Thay đổi trạng thái bàn thành công');
            await tableDiagramModule.getTables();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                const loading = ElLoading.service({
                    target: '.content',
                });
                await tableDiagramModule.getTables();
                loading.close();
            }
        }
    }

    async checkCanSelectTable(
        table: ITable,
        numberSeatRequest = 0,
        timeRequest = new Date(),
    ): Promise<boolean> {
        if (this.checkNumberSeat(numberSeatRequest, table.numberSeat)) {
            switch (table.status) {
                case TableStatus.USED:
                    if (
                        Math.abs(new Date().getTime() - timeRequest.getTime()) <
                        LIMIT_ARRIVAL_TIME_BOOKING
                    ) {
                        const textWarning = `Bàn bạn vừa chọn đang được sử dụng. Vui lòng chọn bàn khác!`;
                        ElMessageBox.alert(textWarning, 'Warning', {
                            confirmButtonText: 'OK',
                        });
                        return false;
                    } else {
                        return true;
                    }
                case TableStatus.BOOKED:
                    return !this.isConflictArrivalOfBookingsOfTable(table, timeRequest);
                default:
                    return true;
            }
        }
        return false;
    }

    async isConflictArrivalOfBookingsOfTable(
        table: ITable,
        timeRequest = new Date(),
    ): Promise<boolean> {
        if (table.status === TableStatus.BOOKED) {
            const loading = ElLoading.service({
                target: '.table-detail-booking-table-data',
            });
            const response = await bookingModule.getBookingsOfTable(table.id);
            loading.close();
            if (response.success) {
                let isConflict = false;
                const bookings = response.data.items;
                for (let i = 0; i < bookings.length; i++) {
                    const timeStamp = bookings[i].arrivalTime;
                    isConflict = this.isConflictTime(timeRequest, timeStamp);
                    if (isConflict) {
                        break;
                    }
                }
                if (!isConflict) {
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
                }
                return isConflict;
            }
        }
        return true;
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

    isConflictTime(oldTime: Date, newTime: Date): boolean {
        if (
            Math.abs(new Date(oldTime).getTime() - new Date(newTime).getTime()) <
            LIMIT_ARRIVAL_TIME_BOOKING
        ) {
            const textWarning = `Bàn bạn vừa chọn đã bị đặt chỗ từ trước. Khách hàng sẽ đến vào lúc ${moment(
                newTime,
            ).fmFullTimeWithoutSecond()}, Vui lòng chọn bàn khác!`;
            ElMessageBox.alert(textWarning, 'Warning', {
                confirmButtonText: 'OK',
            });
            return true;
        }
        return false;
    }
}
