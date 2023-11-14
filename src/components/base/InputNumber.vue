<template>
    <div class="form-group position-relative">
        <label class="mb-2" v-if="label"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <el-input
            v-model="inputData"
            type="number"
            :placeholder="placeholder"
            :readonly="isReadonly"
            :disabled="isDisabled"
            :error="true"
            :min="min"
            :max="max"
            @keydown="preventInput"
            @change="onChange"
            @blur="onBlur"
        />
        <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { DECIMAL_ALLOW_CODES, INTEGER_ALLOW_CODES } from '@/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';
export default class InputText extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly min!: number;
    @Prop({ default: NaN }) readonly max!: number;
    @Prop({ default: false }) readonly allowDecimal!: boolean;

    @Model('value', { type: Number })
    readonly inputData!: number;

    isFocus = false;

    onChange(): void {
        this.isFocus = false;
        this.$emit('change');
    }

    onBlur(): void {
        this.$emit('blur');
    }

    preventInput(event: KeyboardEvent): void {
        switch (event.key) {
            // allow paste
            // allow copy
            // allow select all
            case 'v':
            case 'c':
            case 'a':
                if (!event.ctrlKey) {
                    event.preventDefault();
                }
                break;

            default:
                if (!this.allowDecimal) {
                    if (!INTEGER_ALLOW_CODES.includes(event.code)) {
                        event.preventDefault();
                    }
                } else {
                    if (!DECIMAL_ALLOW_CODES.includes(event.code)) {
                        event.preventDefault();
                    }
                }
                break;
        }
    }
}
</script>

<style scoped>
.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 8px;
}
.mark-required {
    color: red;
}
:deep(.el-input__inner) {
    text-align: left !important;
    height: 36px !important;
}

/* Firefox */
:deep(.el-input__inner) {
    -moz-appearance: textfield;
}
:deep(.el-input__inner::-webkit-outer-spin-button),
:deep(.el-input__inner::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
}
</style>
