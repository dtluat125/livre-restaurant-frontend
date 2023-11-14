<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div
            class="position-relative"
            :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }"
        >
            <el-date-picker
                v-model="dateValue"
                :type="type"
                :placeholder="placeholder"
                :format="dateFormat"
                :value-format="valueFormat"
                :disabled-date="calculateDisabledDates"
                :size="size"
                :clearable="true"
                :disabled="isDisabled"
                :default-value="defaultValue"
                @change="changeValue"
                @panel-change="onNavigateCalendar"
            />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DATE_TIME_FORMAT } from '@/common/constants';
import { Vue, Model, Prop } from 'vue-property-decorator';
import { checkWeekend } from '@/utils/helper';
import moment from 'moment';

export default class DatePicker extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'medium' }) readonly size!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: 'date' }) readonly type!: string;
    @Prop({ default: DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN }) readonly dateFormat!: string;
    @Prop({ default: DATE_TIME_FORMAT.YYYY_MM_DD_HYPHEN }) readonly valueFormat!: string;
    @Prop({ default: null }) readonly minDate!: string | Date;
    @Prop({ default: null }) readonly maxDate!: string | Date;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isDisabledWeekend!: boolean;
    @Prop({ default: null }) readonly defaultValue!: Date | string;
    @Prop({ default: [] }) readonly disabledDates!: string[];
    @Model('value', { type: String })
    readonly dateValue!: string | Date;

    calculateDisabledDates(time: Date): boolean {
        const { minDate, maxDate, isDisabledWeekend } = this.$props as {
            minDate: Date | string;
            maxDate: Date | string;
            isDisabledWeekend: boolean;
        };
        let result = false;
        if (minDate?.toString()?.length) {
            result = result || moment(time).isSameOrBefore(moment(minDate));
        }
        if (maxDate?.toString()?.length) {
            result = result || moment(time).isSameOrAfter(moment(maxDate));
        }
        if (isDisabledWeekend) {
            result = result || checkWeekend(time);
        }
        if (this.disabledDates.length > 0) {
            result = result || this.disabledDates.includes(moment(time).fmDayString());
        }
        return result;
    }

    changeValue(time: Date): void {
        this.$emit('changeValue', time);
    }

    onNavigateCalendar(date: Date): void {
        this.$emit('navigateCalendar', date);
    }
}
</script>

<style scoped>
:dee(.el-input) {
    width: 100% !important;
}
.mark-required {
    color: red;
}
.w-30 {
    word-break: break-word;
    width: 30%;
}
.w-70 {
    width: 70%;
}
:deep(.el-date-editor) {
    width: 100% !important;
}
</style>
