<template>
    <div
        class="form-group d-flex position-relative"
        :class="{ 'flex-column': !isHorizontal }"
    >
        <label
            v-if="label"
            class="fw-bold text-start mb-2"
            :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }">
            <cleave
                v-model="inputData"
                :readonly="isReadonly"
                :placeholder="placeholder"
                :error="true"
                :disabled="isDisabled"
                class="form-control input-money"
                :options="number"
            />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';
import { Options } from 'vue-class-component';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Cleave from 'vue-cleave-component';

@Options({ components: { Cleave } })
export default class InputMoney extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: '' }) value!: string;

    @Model('value', { type: String })
    readonly inputData!: string;

    get number(): Record<string, unknown> {
        return {
            // prefix: 'VND ',
            numeral: true,
            numeralPositiveOnly: true,
            rawValueTrimPrefix: true,
            numeralIntegerScale: 10,
            numeralDecimalScale: 2,
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
.mark-required {
    color: red;
}
.input-money {
    border-radius: 8px;
    outline: none;
    font-size: inherit;
    padding: 0 15px;
    height: 36px;

    line-height: 36px;
}
input:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 0;
}
.w-30 {
    width: 30% !important;
}
.w-70 {
    width: 70% !important;
}
.input-money::placeholder {
    color: #c0c4cc;
}
</style>
