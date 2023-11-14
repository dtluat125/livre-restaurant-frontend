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
                v-model="inputValue"
                :placeholder="placeholder"
                type="textarea"
                :autosize="{ minRows, maxRows }"
                :rows="rows"
                :maxlength="maxLength"
                :show-word-limit="showWordLimit"
            />
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    TEXTAREA_MAX_LENGTH,
    TEXTAREA_MAX_ROW,
    TEXTAREA_DEFAULT_ROWS,
} from '@/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputTextArea extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: TEXTAREA_DEFAULT_ROWS }) readonly rows!: number;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: TEXTAREA_DEFAULT_ROWS }) readonly minRows!: number;
    @Prop({ default: TEXTAREA_MAX_ROW }) readonly maxRows!: number;
    @Prop({ default: TEXTAREA_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: false }) readonly showWordLimit!: boolean;

    @Model('value', { type: [String, Number] })
    readonly inputValue!: string;
}
</script>

<style scoped>
.form-group {
    margin-bottom: 20px;
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
