import { TIMEZONE_NAME_DEFAULT } from '@/common/constants';
import moment from 'moment-timezone';

export function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function isStringify<T>(obj: T | Record<string, unknown>): boolean {
    try {
        JSON.stringify(obj);
    } catch (e) {
        return false;
    }
    return true;
}

export function parseMoney(money: number): string {
    return money || money === 0
        ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'VND',
          }).format(money)
        : '';
}

export function parseDateTime(
    dateTime: Date | string,
    dateTimeFormat = 'YYYY-MM-DD',
): string {
    if (!moment(dateTime).isValid) {
        return '';
    }
    // const currentLanguage = appModule.selectedLanguage as SupportLanguage;
    console.log(dateTime, 'dateTime');
    return moment(dateTime).tz(TIMEZONE_NAME_DEFAULT).format(dateTimeFormat);
}
