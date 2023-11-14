<template>
    <div class="form-group position-relative">
        <label v-if="label"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <el-input
            v-model="inputValue"
            :placeholder="placeholder"
            :type="isShowPassword ? 'text' : 'password'"
            :readonly="isReadonly"
            :disabled="isDisabled"
        >
            <template #suffix>
                <div
                    class="input-password-icon mr-3"
                    @click="isShowPassword = !isShowPassword"
                >
                    <i v-if="isShowPassword" class="fa fa-eye fa-2" />
                    <i v-else class="fa fa-eye-slash fa-2" />
                </div>
            </template>
        </el-input>
        <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { Model, Prop, Vue } from 'vue-property-decorator';
import { randomVid } from '@/utils/commonFunction';

export default class InputPassword extends Vue {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: randomVid }) readonly vid!: string | number;

    isShowPassword = false;

    @Model('value', { type: [String, Number] })
    readonly inputData!: string;
}
</script>

<style scoped>
.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 6px;
}
.input-password-icon {
    cursor: pointer;
}
.fa {
    font-size: 16px;
}
.mark-required {
    color: red;
}
</style>
