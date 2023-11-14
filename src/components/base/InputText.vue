<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal }">
        <label
            v-if="label"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div
            class="position-relative"
            :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }"
        >
            <el-input
                v-model="inputData"
                :placeholder="placeholder"
                type="text"
                :readonly="isReadonly"
                :disabled="isDisabled"
                :error="true"
                :class="{ 'is-focus': isFocus }"
                @focus="onFocus"
                @blur="onBlur"
                @input="onChange"
                :size="size"
                :maxlength="maxLength"
            />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { INPUT_TEXT_MAX_LENGTH } from '@/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';
export default class InputText extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: 'medium' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: INPUT_TEXT_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: null }) readonly cleaveOptions!: Record<string, unknown>;

    @Model('value', { type: [String] })
    readonly inputData!: string;

    isFocus = false;

    onFocus(): void {
        this.isFocus = true;
        this.$emit('focus');
    }

    onBlur(): void {
        this.isFocus = false;
        this.$emit('blur');
    }

    onChange(): void {
        this.$emit('change');
    }
}
</script>

<style scoped>
/** Remove Arrows/Spinners */
/* Chrome, Safari, Edge, Opera */
:deep(.el-input__inner::-webkit-outer-spin-button),
:deep(.el-input__inner::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
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
</style>
