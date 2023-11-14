import { commonService } from '@/common/services/api.services';
import { BookingGuestSchema, BookingSchema, BookingStatus } from './../constants';
import { appModule } from '@/store/app';
import { tableDiagramModule } from './../../table-diagram/store';
import { bookingService } from './../../table-diagram/services/api.service';
import { IBooking, IBookingCreate } from './../types';
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { IBodyResponse } from '@/common/types';
import {
    showSuccessNotificationFunction,
    showErrorNotificationFunction,
    showAlertMessageFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import moment from 'moment';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { bookingModule } from '../store';

export const validateBookingSchema = BookingSchema;
export const validateBookingGuestSchema = BookingGuestSchema;

export function initData() {
    const { t } = useI18n();
    const initValues = {
        nameCustomer: '',
        phone: '',
        numberPeople: undefined,
        arrivalTime: undefined,
    };
    const isGuest = computed(() => appModule.isGuestPage);
    const isCreate = computed(() => !bookingModule.selectedBooking?.id);
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: isGuest.value
            ? validateBookingGuestSchema
            : validateBookingSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createBody = {
            ...values,
            nameCustomer: values.nameCustomer?.trim(),
            phone: values.phone,
            numberPeople: values.numberPeople,
            arrivalTime: moment(values.arrivalTime).utc().fmFullTimeWithoutSecond(),
            tableId: tableDiagramModule.tableSelected?.id,
            status: appModule.isGuestPage
                ? BookingStatus.WAITING_FOR_APPROVE
                : BookingStatus.WAITING,
        } as IBookingCreate;
        let response;
        const bookingId = bookingModule.selectedBooking?.id;
        const loading = ElLoading.service({
            target: '.booking-form-popup',
        });
        if (isGuest.value) {
            response = await commonService.createGuestBooking(createBody);
        } else if (!isCreate.value) {
            response = await bookingService.update(bookingId as number, createBody);
        } else {
            response = await bookingService.create(createBody);
        }
        loading.close();
        if (response.success) {
            isGuest.value
                ? await showAlertMessageFunction(
                      t('booking.booking.message.waitConfirm.message') as string,
                      t('booking.booking.message.waitConfirm.title') as string,
                      {},
                  )
                : showSuccessNotificationFunction(
                      !isCreate.value
                          ? t('booking.booking.message.update.success')
                          : (t('booking.booking.message.create.success') as string),
                  );
            bookingModule.setBookingQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            const loading = ElLoading.service({
                target: '.content',
            });
            if (!isGuest.value) await bookingModule.getBookings();
            loading.close();
            await bookingModule.setIsShowBookingFormPopUp(false);
        } else {
            showErrorNotificationFunction(response.message as string);
            const loading = ElLoading.service({
                target: '.content',
            });
            if (!isGuest.value) await bookingModule.getBookings();
            loading.close();
        }
    });
    const { value: nameCustomer } = useField('nameCustomer');
    const { value: phone } = useField('phone');
    const { value: numberPeople } = useField('numberPeople');
    const { value: arrivalTime } = useField('arrivalTime');

    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({
                target: '.booking-form-popup',
            });
            const bookingDetail = (await bookingService.getDetail(
                bookingModule.selectedBooking?.id || 0,
            )) as IBodyResponse<IBooking>;
            resetForm({
                values: {
                    nameCustomer: bookingDetail.data?.nameCustomer,
                    phone: bookingDetail.data?.phone,
                    numberPeople: bookingDetail.data?.numberPeople,
                    arrivalTime: moment(
                        bookingDetail.data?.arrivalTime,
                    ).fmFullTimeWithoutSecond(),
                },
            });
            tableDiagramModule.setTableSelected(bookingDetail.data.tablesRestaurant);
            loading.close();
        } else {
            resetForm({
                values: initValues,
            });
        }
    };
    return {
        nameCustomer,
        phone,
        numberPeople,
        arrivalTime,
        errors,

        validate,
        openPopup,
        onSubmit,
        resetForm,
        isCreate,
    };
}
