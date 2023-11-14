<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label && label !== 'team'"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div
            class="position-relative"
            :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }"
        >
            <el-select
                v-model="selectedValue"
                :placeholder="selectedValue ? '' : placeholder"
                :filterable="filterable"
                popper-class="select-options"
                :size="size"
                :disabled="isDisabled"
                @change="onChange"
                @focus="onFocus"
                @visible-change="onVisibleChange"
                ref="singleSelect"
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
    </div>
</template>

<script lang="ts">
import { ISelectForm } from '@/common/types';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class SingleSelect extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: () => [] }) readonly options!: Record<string, unknown>[];
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    @Model('value', { type: [String, Number] })
    readonly selectedValue!: string;

    optionStyle: Record<string, string> = {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        height: 'auto',
    };

    get selectedRef() {
        return this.$refs.singleSelect;
    }

    onChange(): void {
        this.$emit('change');
    }

    onFocus(): void {
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    onVisibleChange(visible: boolean): void {
        this.$emit('visible-change', visible);
    }

    mounted(): void {
        this.onFocus();
    }
}
</script>

<style lang="scss" scoped>
.el-select {
    width: 100% !important;
}
:deep(.select-options) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    text-align: left;
    left: 0px !important;
}
:deep(.el-input) {
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
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
:deep(.el-input__inner) {
    height: 32px !important;
}
</style>
