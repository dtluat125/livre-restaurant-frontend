<template>
    <BaseTableLayout
        :data="bookingList"
        class="booking-table-data"
        :isHighlightCurrentRow="true"
        v-model:selectedPage="selectedPage"
        :totalItems="totalItems"
        @handlePaginate="handlePaginate"
    >
        <template #table-columns>
            <el-table-column
                align="center"
                :label="$t('booking.booking.bookingTable.header.id')"
                type="index"
                width="75"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('booking.booking.bookingTable.header.nameCustomer')"
                width="200"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__name">
                        {{ scope.row.nameCustomer }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                :label="$t('booking.booking.bookingTable.header.phone')"
                width="170"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__phone">
                        {{ scope.row.phone }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="arrivalTime"
                :label="$t('booking.booking.bookingTable.header.arrivalTime')"
                width="250"
                sortable="custom"
            >
                <template #default="scope">
                    <div class="booking__table__arrival_time">
                        {{
                            scope.row.arrivalTime
                                ? parseDateTime(
                                      scope.row.arrivalTime,
                                      YYYY_MM_DD_HYPHEN_HH_MM_COLON,
                                  )
                                : ''
                        }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.numberPeople')"
                width="200"
            >
                <template #default="scope">
                    <div class="booking__table__name_table">
                        {{ scope.row.numberPeople }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.table')"
                width="150"
            >
                <template #default="scope">
                    <div class="booking__table__name_table">
                        {{ scope.row.tablesRestaurant?.name || '' }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="idCategory"
                :label="$t('booking.booking.bookingTable.header.status')"
                width="180"
            >
                <template #default="scope">
                    <div
                        :class="`badge status-field badge-md bg-${statusBadge(
                            scope.row.status,
                        )}`"
                    >
                        {{ $t(`booking.booking.status.${scope.row.status}`) }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                :label="$t('booking.booking.bookingTable.header.actions')"
                width="170"
                fixed="right"
                v-if="isCanUpdate"
            >
                <template #default="scope">
                    <div class="booking-table-action">
                        <el-tooltip
                            effect="dark"
                            :content="$t('booking.booking.tooltip.confirm')"
                            placement="top"
                            v-if="scope.row.status == BookingStatus.WAITING_FOR_APPROVE"
                        >
                            <div class="booking-approve action-button">
                                <el-popconfirm
                                    :confirm-button-text="
                                        $t('booking.booking.message.button.confirm')
                                    "
                                    :cancel-button-text="
                                        $t('booking.booking.message.button.cancel')
                                    "
                                    icon-color="green"
                                    :title="
                                        $t('booking.booking.message.approve.confirmAsk')
                                    "
                                    @confirm.stop="
                                        changeStatus(scope.row, BookingStatus.WAITING)
                                    "
                                >
                                    <template #reference>
                                        <SelectIcon class="icon-class" />
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-tooltip>

                        <el-tooltip
                            effect="dark"
                            :content="$t('booking.booking.tooltip.done')"
                            placement="top"
                            v-if="
                                scope.row.status == BookingStatus.WAITING &&
                                scope.row.tablesRestaurant
                            "
                        >
                            <div class="booking-done action-button">
                                <el-popconfirm
                                    :confirm-button-text="
                                        $t('booking.booking.message.button.confirm')
                                    "
                                    :cancel-button-text="
                                        $t('booking.booking.message.button.cancel')
                                    "
                                    icon-color="green"
                                    :title="
                                        $t('booking.booking.message.complete.confirmAsk')
                                    "
                                    @confirm.stop="
                                        changeStatus(scope.row, BookingStatus.DONE)
                                    "
                                >
                                    <template #reference>
                                        <MapLocationIcon class="icon-class" />
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-tooltip>

                        <el-tooltip
                            effect="dark"
                            :content="$t('booking.booking.tooltip.canceled')"
                            placement="top"
                            v-if="
                                scope.row.status == BookingStatus.WAITING ||
                                scope.row.status == BookingStatus.WAITING_FOR_APPROVE
                            "
                        >
                            <div class="booking-canceled action-button">
                                <el-popconfirm
                                    :confirm-button-text="
                                        $t('booking.booking.message.button.confirm')
                                    "
                                    :cancel-button-text="
                                        $t('booking.booking.message.button.cancel')
                                    "
                                    icon-color="red"
                                    :title="
                                        $t('booking.booking.message.canceled.confirmAsk')
                                    "
                                    @confirm.stop="
                                        changeStatus(scope.row, BookingStatus.CANCELED)
                                    "
                                >
                                    <template #reference>
                                        <DeleteLocationIcon class="icon-class" />
                                    </template>
                                </el-popconfirm>
                            </div>
                        </el-tooltip>
                        <el-tooltip
                            effect="dark"
                            :content="$t('booking.booking.tooltip.edit')"
                            placement="top"
                            v-if="
                                scope.row.status == BookingStatus.WAITING ||
                                scope.row.status == BookingStatus.WAITING_FOR_APPROVE
                            "
                        >
                            <div
                                class="booking-change-table action-button"
                                @click="updateBooking(scope.row)"
                            >
                                <EditIcon class="icon-class" />
                            </div>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-property-decorator';

import { IBooking } from '../types';
import { bookingModule } from '../store';
import { BookingMixins } from '../mixins';
import { bookingService } from '@/modules/table-diagram/services/api.service';
import { tableDiagramModule } from '@/modules/table-diagram/store';
import { BookingStatus } from '../constants';
import {
    checkUserHasPermission,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import {
    Select as SelectIcon,
    Edit as EditIcon,
    MapLocation as MapLocationIcon,
    DeleteLocation as DeleteLocationIcon,
} from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { PermissionResources, PermissionActions } from '@/modules/role/constants';
@Options({
    name: 'booking-table-component',
    components: {
        SelectIcon,
        EditIcon,
        MapLocationIcon,
        DeleteLocationIcon,
    },
})
export default class BookingTable extends mixins(BookingMixins) {
    get bookingList(): IBooking[] {
        return bookingModule.bookingList;
    }

    get selectedPage(): number {
        return bookingModule.bookingQueryString?.page || DEFAULT_FIRST_PAGE;
    }

    set selectedPage(value: number) {
        bookingModule.bookingQueryString.page = value;
    }

    get totalItems(): number {
        return bookingModule.totalBookings;
    }

    get isCanUpdate(): boolean {
        return checkUserHasPermission(bookingModule.userPermissions, [
            `${PermissionResources.BOOKING}_${PermissionActions.UPDATE}`,
        ]);
    }

    created(): void {
        bookingModule.getBookings();
    }

    async changeStatus(booking: IBooking, status: BookingStatus): Promise<void> {
        const response = await bookingService.update(booking.id, {
            status: status,
            arrivalTime: booking?.arrivalTime,
            tableId: booking?.tablesRestaurant?.id || '',
            nameCustomer: booking?.nameCustomer || '',
            phone: booking?.phone || '',
        });
        if (response.success) {
            showSuccessNotificationFunction(
                i18n.global.t('booking.booking.message.update.success'),
            );
            bookingModule.getBookings();
            tableDiagramModule.setCanChosenTable(false);
        } else {
            showErrorNotificationFunction(response.message as string);
            const loading = ElLoading.service({
                target: '.content',
            });
            await bookingModule.getBookings();
            loading.close();
        }
    }

    statusBadge(status: BookingStatus): string {
        switch (status) {
            case BookingStatus.WAITING:
            case BookingStatus.WAITING_FOR_APPROVE:
                return 'info';
            case BookingStatus.DONE:
                return 'success';
            case BookingStatus.CANCELED:
                return 'danger';
        }
    }

    async handlePaginate(): Promise<void> {
        bookingModule.setBookingQueryString({ page: this.selectedPage });
        this.getBookingList();
    }

    async getBookingList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await bookingModule.getBookings();
        loading.close();
    }

    updateBooking(booking: IBooking): void {
        bookingModule.setIsShowBookingFormPopUp(true);
        bookingModule.setSelectedBooking(booking);
    }
}
</script>

<style lang="scss" scoped>
.header-options-table {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.booking-table-action {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;

    .booking-approve:hover {
        color: green;
        border: 2px solid rgb(3, 180, 3);
    }

    .booking-done:hover {
        color: green;
        border: 2px solid rgb(3, 180, 3);
    }

    .booking-canceled:hover {
        color: red;
        border: 2px solid rgb(235, 0, 0);
    }

    .booking-change-table:hover {
        color: rgb(0, 183, 196);
        border: 2px solid rgb(21, 239, 255);
    }
}

.icon-class {
    height: 25px;
    width: 25px;
}

.action-button {
    cursor: pointer;
    border-radius: 5px;
    border: solid 2px #fff;
}
</style>
