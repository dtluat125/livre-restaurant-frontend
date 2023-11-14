import { appService } from '../../../utils/app';
import { reportRevenueModule } from '../store';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { validateReportRevenueSchema } from '../constants';
import { IBodyResponse } from '@/common/types';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';
import { IReportRevenue, IReportRevenueUpdateBody } from '../types';
import { reportRevenueService } from '../services/report-revenue.api.services';

export function initData() {
    const { t } = useI18n();
    const initValues = {
        shift: undefined,
        shiftLeaderId: undefined,
        cashAtBeginningOfShift: undefined,
        cashAtEndingOfShift: undefined,
        bankingRevenue: undefined,
        differenceRevenue: 0,
        note: '',
        billingRevenue: 0,
    };
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateReportRevenueSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createBody = {
            shiftLeaderId: appService.getUser().id,
            shift: values.shift,
            cashAtBeginningOfShift: values.cashAtBeginningOfShift,
            cashAtEndingOfShift: values.cashAtEndingOfShift,
            bankingRevenue: values.bankingRevenue,
            differenceRevenue: values.differenceRevenue,
            note: values.note,
        } as IReportRevenueUpdateBody;
        const reportRevenueId = reportRevenueModule.selectedReportRevenue?.id;
        const loading = ElLoading.service({
            target: '.report-revenue-form',
        });
        const response = await reportRevenueService.update(
            reportRevenueId as number,
            createBody,
        );

        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                t('menu.reportRevenue.message.update.success'),
            );
            reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
            reportRevenueModule.setReportRevenueQueryString({
                page: DEFAULT_FIRST_PAGE,
            });
            const loading = ElLoading.service({
                target: '.content',
            });
            await reportRevenueModule.getReportRevenueList();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                reportRevenueModule.setIsShowReportRevenueFormPopUp(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await reportRevenueModule.getReportRevenueList();
                loading.close();
            }
        }
    });
    const { value: shift } = useField('shift');
    const { value: shiftLeaderId } = useField('shiftLeaderId');
    const { value: cashAtBeginningOfShift } = useField('cashAtBeginningOfShift');
    const { value: cashAtEndingOfShift } = useField('cashAtEndingOfShift');
    const { value: bankingRevenue } = useField('bankingRevenue');
    const { value: differenceRevenue } = useField('differenceRevenue');
    const { value: note } = useField('note');
    const { value: billingRevenue } = useField('billingRevenue');

    const openPopup = async () => {
        const loading = ElLoading.service({ target: '.report-revenue-form-popup' });
        const reportRevenueDetail = (await reportRevenueService.getDetail(
            reportRevenueModule.selectedReportRevenue?.id || 0,
        )) as IBodyResponse<IReportRevenue>;
        loading.close();
        resetForm({
            values: {
                shift: reportRevenueDetail.data?.shift,
                cashAtBeginningOfShift: reportRevenueDetail.data?.cashAtBeginningOfShift,
                cashAtEndingOfShift: reportRevenueDetail.data?.cashAtEndingOfShift,
                bankingRevenue: reportRevenueDetail.data?.bankingRevenue,
                differenceRevenue: reportRevenueDetail.data?.differenceRevenue,
                note: reportRevenueDetail.data?.note,
                billingRevenue: reportRevenueDetail.data?.billingRevenue | 0,
            },
        });
    };
    return {
        errors,
        shift,
        shiftLeaderId,
        cashAtBeginningOfShift,
        billingRevenue,
        cashAtEndingOfShift,
        bankingRevenue,
        differenceRevenue,
        note,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}

export const setupDelete = () => {
    const deleteReportRevenue = async (id: number) => {
        const isConfirm = await showConfirmPopUpFunction(
            i18n.global.t('menu.reportRevenue.message.delete.confirmAsk') as string,
            i18n.global.t('menu.reportRevenue.message.delete.title') as string,
            {},
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await reportRevenueService.delete(id);
            loading.close();
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('menu.reportRevenue.message.delete.success') as string,
                );
                reportRevenueModule.setReportRevenueQueryString({
                    page: DEFAULT_FIRST_PAGE,
                });
                const loading = ElLoading.service({
                    target: '.content',
                });
                await reportRevenueModule.getReportRevenueList();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message);
                if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                    const loading = ElLoading.service({
                        target: '.content',
                    });
                    await reportRevenueModule.getReportRevenueList();
                    loading.close();
                }
            }
        }
    };

    return { deleteReportRevenue };
};
