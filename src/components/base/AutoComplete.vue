<template>
    <div class="form-group d-flex 1" :class="{ 'flex-column': !isHorizontal }">
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
            <el-autocomplete
                v-model="inputValue"
                :fetch-suggestions="querySearch"
                :placeholder="placeholder"
                @select="handleSelect"
                :size="size"
                :maxlength="maxLength"
            >
            </el-autocomplete>
            <div class="invalid-feedback text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { INPUT_TEXT_MAX_LENGTH } from '@/common/constants';
import { Model, Prop, Vue } from 'vue-property-decorator';

export default class InputTextArea extends Vue {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: () => [] }) readonly options!: string[];
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: 'medium' }) readonly size!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: INPUT_TEXT_MAX_LENGTH }) readonly maxLength!: number;

    @Model('value', { type: [String, Number] })
    readonly inputValue!: string;

    querySearch(queryString: string, cb: CallableFunction): void {
        var results = queryString
            ? this.options.filter((option) => {
                  return option
                      .toString()
                      .toLowerCase()
                      .includes(queryString.toLowerCase());
              })
            : this.options;
        // we have to parse options array to the array which includes objects with "value" property
        const resultOptions: Record<string, unknown>[] = [];
        results.forEach((item) => {
            resultOptions.push({ value: item });
        });
        cb(resultOptions);
    }

    handleSelect(): void {
        this.$emit('select');
    }
}
</script>

<style scoped>
:deep(.el-autocomplete) {
    width: 100% !important;
}
.mark-required {
    color: red;
}
.w-30 {
    width: 30%;
}
.w-70 {
    width: 70%;
}
</style>
