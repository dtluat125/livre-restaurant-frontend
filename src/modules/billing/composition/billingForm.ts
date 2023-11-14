import { appService } from './../../../utils/app';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import { billingService } from '../services/api.services';
import { billingModule } from '../store';
import { validateBillingSchema } from '../constants';
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { IBodyResponse } from '@/common/types';
import { IBillingUpdate, IBilling, BillingStatus } from '../types';

export function initData() {
    const { t } = useI18n();
    const initValues = {
        customerName: '',
        customerPhone: '',
        paymentMethod: undefined,
        billingStatus: BillingStatus.WAIT_FOR_SELECT_FOOD,
        paymentTime: '',
        paymentTotal: 0,
        cashier: '',
        note: '',
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateBillingSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const body = {
            customerName: values.customerName?.trim(),
            customerPhone: values.customerPhone?.trim(),
            cashierId: appService.getUser().id,
            paymentTotal: billingModule.paymentTotal,
            paymentMethod: values.paymentMethod,
            paymentTime: moment(new Date()).utc().fmFullTimeWithoutSecond(),
            billingStatus: BillingStatus.PAID,
            note: values.note?.trim(),
        } as IBillingUpdate;
        const billingId = billingModule.selectedBilling?.id;
        const loading = ElLoading.service({
            target: '.billing-form-popup',
        });
        const response = await billingService.update(billingId as number, body);

        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                t('billing.billing.message.updateSuccess') as string,
            );
            billingModule.setIsShowBillingFormPopUp(false);
            billingModule.setBillingQueryString({ page: DEFAULT_FIRST_PAGE });
            const loading = ElLoading.service({
                target: '.content',
            });
            await billingModule.getBillingList();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                billingModule.setIsShowBillingFormPopUp(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await billingModule.getBillingList();
                loading.close();
            }
        }
    });
    const { value: customerName } = useField('customerName');
    const { value: customerPhone } = useField('customerPhone');
    const { value: paymentMethod } = useField('paymentMethod');
    const { value: billingStatus } = useField('billingStatus');
    const { value: paymentTime } = useField('paymentTime');
    const { value: cashier } = useField('cashier');
    const { value: note } = useField('note');
    const { value: paymentTotal } = useField('paymentTotal');

    const openPopup = async () => {
        const loading = ElLoading.service({ target: '.billing-form-popup' });
        await billingModule.getFoodBillingList();
        const billingDetail = (await billingService.getDetail(
            billingModule.selectedBilling?.id || 0,
        )) as IBodyResponse<IBilling>;
        loading.close();

        resetForm({
            values: {
                customerName: billingDetail.data?.customerName || '',
                customerPhone: billingDetail.data?.customerPhone || '',
                paymentMethod: billingDetail.data?.paymentMethod,
                billingStatus: billingDetail.data?.billingStatus,
                cashier: billingDetail.data?.cashier?.fullName
                    ? billingDetail.data?.cashier?.fullName
                    : appService.getUser().fullName,
                paymentTime: billingDetail.data?.paymentTime
                    ? moment(billingDetail.data?.paymentTime)
                          .utc()
                          .fmFullTimeWithoutSecond()
                    : moment(new Date()).utc().fmFullTimeWithoutSecond(),
                note: billingDetail.data?.note,
            },
        });
    };
    return {
        errors,
        customerName,
        customerPhone,
        paymentMethod,
        billingStatus,
        paymentTime,
        cashier,
        note,
        paymentTotal,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}
