import { UtilMixins } from '@/mixins/utilMixins';
import { mixins } from 'vue-class-component';
import { DateRangeTypes } from './constant';

export class DashboardMixins extends mixins(UtilMixins) {
    dateRangeTypes = DateRangeTypes;
}
