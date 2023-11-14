import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';
import i18n from '@/plugins/vue-i18n';
import moment from 'moment';

export class MenuMixins extends mixins(UtilMixins) {
    YYYY_MM_DD_HYPHEN_HH_MM_COLON = this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_COLON;

    parseDateTimeTime = (date: string): string => {
        if (!date) {
            return '';
        }
        return `${moment(date).fmHourMinuteString()} ${i18n.global.t(
            'recruitment.candidate.info.at',
        )} ${moment(date).fmDayString()}`;
    };
}
