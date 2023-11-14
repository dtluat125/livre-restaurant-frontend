<template>
    <div class="form-group position-relative">
        <label v-if="label" class="fw-bold text-start mb-2"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <el-select
            v-model="selectedValue"
            :placeholder="selectedValue?.length > 0 ? '' : placeholder"
            :filterable="filterable"
            :clearable="clearable"
            multiple
            :collapse-tags="collapseTags"
            popper-class="select-options"
            @keyup="press"
            @change="change"
            @focus="onFocus"
            ref="multipleSelect"
        >
            <template v-for="option in options" :key="option.value">
                <el-option
                    :label="option.label"
                    :value="option.value"
                    :id="`option_${option.value}`"
                    :style="optionStyle"
                />
            </template>
        </el-select>
        <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { KEYBOARD_EVENT_CODE } from '@/common/constants';
import { ISelectForm } from '@/common/types';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class MultipleSelect extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: true }) readonly collapseTags!: boolean;
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: () => [] }) readonly options!: Record<string, unknown>[];
    @Prop({ default: true }) readonly clearable!: boolean;

    @Model('value', { type: Array as () => string[] | number[] })
    readonly selectedValue!: string[] | number[];

    optionStyle: Record<string, string> = {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        height: 'auto',
    };

    get selectedRef() {
        return this.$refs.multipleSelect;
    }

    press(event: KeyboardEvent): void {
        if (event.code === KEYBOARD_EVENT_CODE.ENTER) {
            (this.$refs.select as any).blur();
        }
    }

    change(): void {
        this.$nextTick(() => {
            this.$emit('change');
        });
    }

    onFocus(): void {
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }
}
</script>

<style lang="scss" scoped>
.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 6px;
}
.el-select {
    width: 100% !important;
}
:deep(.select-options) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    text-align: left;
}
:deep(.el-input) {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
:deep(.popper__arrow) {
    display: none !important;
}
.mark-required {
    color: red;
}
:deep(.el-select-dropdown__list) {
    padding: 0px !important;
}
:deep(.el-select__input) {
    cursor: pointer !important;
}
:deep(.el-select__tags) {
    max-width: unset !important;
}
</style>
