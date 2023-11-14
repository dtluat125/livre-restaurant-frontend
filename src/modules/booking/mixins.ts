import { BookingStatus } from './constants';
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-property-decorator';

export class BookingMixins extends mixins(UtilMixins) {
    YYYY_MM_DD_HYPHEN_HH_MM_COLON = this.DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN_HH_MM_COLON;
    BookingStatus = BookingStatus;
}
