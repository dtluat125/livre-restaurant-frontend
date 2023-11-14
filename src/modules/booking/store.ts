import { bookingService } from './../table-diagram/services/api.service';
import { getModule, VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import store from '@/store';
import { IBooking, IQueryStringBooking, IBookingUpdate } from './types';
import {
    DEFAULT_FIRST_PAGE,
    LIMIT_PER_PAGE,
    DEFAULT_ORDER_DIRECTION,
    HttpStatus,
} from '@/common/constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { DEFAULT_ORDER_BY } from '../user/constants';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import { showErrorNotificationFunction } from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { BookingStatus } from './constants';

const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: null,
    status: null,
    tableId: null,
    arrivalTimeRange: null,
};

@Module({ dynamic: true, namespaced: true, store, name: 'booking' })
class BookingModule extends VuexModule {
    bookingList: Array<IBooking> = [];
    bookingTableDetailList: Array<IBooking> = [];

    totalBookings = 0;
    totalBookingTableDetail = 0;

    selectedBooking: IBookingUpdate | null = null;

    isShowSetupTableOfBookingPopup = false;
    isShowModalTableDetail = false;

    bookingQueryString: IQueryStringBooking = initQueryString;
    bookingTableQueryString: IQueryStringBooking = initQueryString;

    isShowBookingFormPopUp = false;
    isDisabledSaveButton = false;

    // GETTERS
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.BOOKING);
    }

    @Mutation
    MUTATE_BOOKING_LIST(data: Array<IBooking>) {
        this.bookingList = data;
    }

    @Mutation
    MUTATE_TOTAL_BOOKINGS(totalBookings: number) {
        this.totalBookings = totalBookings;
    }

    @Mutation
    MUTATE_IS_SHOW_SETUP_TABLE_OF_BOOKING(data: boolean) {
        this.isShowSetupTableOfBookingPopup = data;
    }

    @Mutation
    UPDATE_CHECK_SHOW_MODAL_TABLE_DETAIL(data: boolean) {
        this.isShowModalTableDetail = data;
    }

    @Mutation
    MUTATE_BOOKING_QUERY_STRING(query: IQueryStringBooking) {
        this.bookingQueryString = {
            ...this.bookingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_BOOKING_TABLE_QUERY_STRING(query: IQueryStringBooking) {
        this.bookingTableQueryString = {
            ...this.bookingTableQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_IS_SHOW_BOOKING_FORM_POP_UP(value: boolean) {
        this.isShowBookingFormPopUp = value;
    }

    @Mutation
    MUTATE_SELECTED_BOOKING(booking: IBookingUpdate | null) {
        this.selectedBooking = booking;
    }

    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(value: boolean) {
        this.isDisabledSaveButton = value;
    }

    @Mutation
    MUTATE_BOOKING_TABLE_DETAIL_LIST(data: Array<IBooking>) {
        this.bookingTableDetailList = data;
    }

    @Mutation
    MUTATE_TOTAL_BOOKING_TABLE_DETAIL(data: number) {
        this.totalBookingTableDetail = data;
    }

    // ACTION

    @Action
    setIsShowSetupTableOfBookingPopup(data: boolean) {
        this.MUTATE_IS_SHOW_SETUP_TABLE_OF_BOOKING(data);
    }

    @Action
    updateCheckShowModalTableDetail(data: boolean) {
        this.UPDATE_CHECK_SHOW_MODAL_TABLE_DETAIL(data);
    }

    @Action
    clearBookingQueryString() {
        this.MUTATE_BOOKING_QUERY_STRING(initQueryString);
    }

    @Action
    clearBookingTableQueryString() {
        this.MUTATE_BOOKING_TABLE_QUERY_STRING(initQueryString);
    }

    @Action
    setBookingQueryString(query: IQueryStringBooking) {
        this.MUTATE_BOOKING_QUERY_STRING(query);
    }

    @Action
    setBookingTableQueryString(query: IQueryStringBooking) {
        this.MUTATE_BOOKING_TABLE_QUERY_STRING(query);
    }

    @Action
    setIsShowBookingFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_BOOKING_FORM_POP_UP(value);
    }

    @Action
    setSelectedBooking(booking: IBookingUpdate | null) {
        console.log(booking);

        this.MUTATE_SELECTED_BOOKING(booking);
    }

    @Action
    setIsDisabledSaveButton(value: boolean) {
        this.MUTATE_IS_DISABLED_SAVE_BUTTON(value);
    }

    @Action
    updateBookingTableDetailList(data: Array<IBooking>) {
        this.MUTATE_BOOKING_TABLE_DETAIL_LIST(data);
    }

    // API Table
    @Action
    async getBookings() {
        const loading = ElLoading.service({
            target: '.content',
        });
        const response = (await bookingService.getList({
            ...this.bookingQueryString,
        })) as IBodyResponse<IGetListResponse<IBooking>>;
        loading.close();
        if (response.success) {
            this.MUTATE_BOOKING_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_BOOKINGS(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_BOOKING_LIST([]);
            this.MUTATE_TOTAL_BOOKINGS(0);
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                const loading = ElLoading.service({
                    target: '.content',
                });
                loading.close();
            }
        }
        return response;
    }

    @Action
    async getBookingsOfTable(tableId: number) {
        this.MUTATE_BOOKING_TABLE_QUERY_STRING({
            tableId,
            status: [BookingStatus.WAITING],
        });
        const response = (await bookingService.getList({
            ...this.bookingTableQueryString,
        })) as IBodyResponse<IGetListResponse<IBooking>>;
        if (response.success) {
            this.MUTATE_BOOKING_TABLE_DETAIL_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_BOOKING_TABLE_DETAIL(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_BOOKING_TABLE_DETAIL_LIST([]);
            this.MUTATE_TOTAL_BOOKING_TABLE_DETAIL(0);
            showErrorNotificationFunction(response.message as string);
        }
        return response;
    }
}

export const bookingModule = getModule(BookingModule);
