import { DATE_TIME_FORMAT } from '@/common/constants';
import { DateRangeTypes } from '@/modules/dashboard/constant';
import moment from 'moment-timezone';

export function getDateRanges(filterForm: any) {
    const dateRanges = [];
    if (filterForm.dateRange?.length) {
        if (filterForm.dateRangeType === DateRangeTypes.MONTH) {
            dateRanges.push(
                moment(filterForm.dateRange)
                    .startOf('year')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
            dateRanges.push(
                moment(filterForm.dateRange)
                    .endOf('year')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
        } else {
            dateRanges.push(
                moment(filterForm.dateRange)
                    .startOf('month')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
            dateRanges.push(
                moment(filterForm.dateRange)
                    .endOf('month')
                    .format(DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON),
            );
        }
    }

    return dateRanges;
}
