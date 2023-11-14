import { ISelectOptions, IPopupAttributes } from '@/common/types';
import i18n from '@/plugins/vue-i18n';
import Papa from 'papaparse';
import { ElMessageBox, ElNotification, MessageBoxData } from 'element-plus';
import moment from 'moment';
import { WeekDay } from '@/common/constants';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import trim from 'lodash/trim';
import intersection from 'lodash/intersection';
import { appService } from './app';

export function parseSelectOptions(options: ISelectOptions[]): ISelectOptions[] {
    return options.map((option: ISelectOptions) => ({
        label: option.label,
        value: option.value,
    }));
}

export function parseLanguageSelectOptions(options: ISelectOptions[]): ISelectOptions[] {
    return options.map((option: ISelectOptions) => ({
        label: i18n.global.t(`${option.label}`),
        value: option.value,
    }));
}

export async function fileToLines(file: File, header: boolean): Promise<unknown> {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: header,
            download: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function (results) {
                resolve(results.data);
            },
        });
    });
}

export async function showConfirmPopUpFunction(
    message: string,
    title: string,
    options?: IPopupAttributes,
): Promise<void | MessageBoxData> {
    const confirmButtonText =
        options?.confirmButtonText ||
        (i18n.global.t('common.app.buttons.confirm') as string);
    const cancelButtonText =
        options?.cancelButtonText ||
        (i18n.global.t('common.app.buttons.cancel') as string);
    const confirmButtonClass = options?.confirmButtonClass || 'el-button--danger';
    const cancelButtonClass = options?.cancelButtonClass || 'el-button--default';
    const distinguishCancelAndClose = options?.distinguishCancelAndClose || true;
    const type = options?.type || 'warning';
    const showCancelButton = options?.showCancelButton || true;
    const result = await ElMessageBox.confirm(
        message,
        title,
        {
            distinguishCancelAndClose,
            type,
            confirmButtonText,
            cancelButtonText,
            confirmButtonClass,
            cancelButtonClass,
            showCancelButton,
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ).catch(() => {});
    return result;
}

export function showSuccessNotificationFunction(message: string, title?: string): void {
    ElNotification({
        type: 'success',
        title: title || (i18n.global.t('common.app.notification') as string),
        message,
    });
}

export function showErrorNotificationFunction(message?: string, title?: string): void {
    ElNotification({
        type: 'error',
        title: title || (i18n.global.t('common.app.notification') as string),
        message,
    });
}

export async function showAlertMessageFunction(
    message: string,
    title?: string,
    options?: IPopupAttributes,
): Promise<MessageBoxData> {
    const confirmButtonText =
        options?.confirmButtonText || (i18n.global.t('common.app.buttons.ok') as string);
    const cancelButtonText =
        options?.cancelButtonText ||
        (i18n.global.t('common.app.buttons.cancel') as string);
    const confirmButtonClass = options?.confirmButtonClass || 'el-button--danger';
    const cancelButtonClass = options?.cancelButtonClass || 'el-button--default';
    const distinguishCancelAndClose = options?.distinguishCancelAndClose || true;
    const type = options?.type || 'warning';
    const showCancelButton = options?.showCancelButton || false;
    return await ElMessageBox.alert(
        message,
        title || i18n.global.t('common.app.notification'),
        {
            distinguishCancelAndClose,
            type,
            confirmButtonText,
            cancelButtonText,
            confirmButtonClass,
            cancelButtonClass,
            showCancelButton,
        },
    );
}

export function checkWeekend(date: string | Date): boolean {
    const day = moment(date).day();
    return day === WeekDay.SATURDAY || day === WeekDay.SUNDAY;
}

export function trimObject(body: any): void {
    const trimValue = (item: any) => {
        mapKeys(item, (value, key) => {
            // remove string contain only space characters
            if (typeof value === 'string') {
                item[key] = value.trim();
            }

            // iterate array
            else if (Array.isArray(value)) {
                value.forEach((subValue, index) => {
                    // remove string contain only space characters
                    if (typeof subValue === 'string' && !trim(subValue as string)) {
                        value.splice(index, 1);
                    } else if (isPlainObject(subValue)) {
                        trimValue(subValue);
                    }
                });
            } else if (isPlainObject(value)) {
                trimValue(value);
            }
        });
    };

    trimValue(body);
}

export function checkUserHasPermission(
    userPermissions: string[],
    permissions: string[],
): boolean {
    if (appService.getUser().isSuperAdmin) return true;
    return intersection(userPermissions, permissions).length > 0;
}
