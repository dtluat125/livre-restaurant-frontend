<template>
    <div class="cp-header">
        <!-- Cpanel Left -->
        <div class="cp-left">
            <h3 class="cp-page-title">{{ pageTitle }}</h3>
        </div>
        <!-- End Cpanel Left -->

        <!-- Cpanel Right -->
        <div class="cp-rigt">
            <div class="cp-pagination-action">
                <span
                    ><el-button @click="handleBtnCancel">{{
                        cancelButtonText
                    }}</el-button></span
                >
                <span style="margin-left: 10px"
                    ><el-button
                        :disabled="disableBtnSave"
                        @click="handleBtnSave"
                        type="primary"
                        >{{ createButtonText }}</el-button
                    ></span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';

export default class PanelHeader extends Vue {
    @Prop({ default: '' }) readonly pageTitle!: string;
    @Prop({ default: '' }) readonly createButtonText!: string;
    @Prop({ default: '' }) readonly cancelButtonText!: string;
    @Prop({ default: false }) readonly disableBtnSave!: boolean;

    handleBtnCancel(): void {
        this.$emit('cancel');
    }

    handleBtnSave(): void {
        this.$emit('save');
    }
}
</script>

<style scoped lang="scss">
.cp-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 18px 20px;
    @media only screen and (max-width: 991.98px) {
        margin: -15px -15px 0 -15px;
    }
    @media (min-width: 576px) {
        display: flex;
        justify-content: space-between;
    }
    position: sticky;
    top: 64px;
    z-index: map-get($map: $zIndex, $key: cpHeader);
}
.cp-page-title {
    font-size: 20px;
    color: #212121;
    font-weight: 400;
    margin: 0;
    margin-right: 15px;
    @media (max-width: 980px) {
        margin-left: 15px;
    }
}
.cp-left {
    padding-top: 20px !important;
}
.cp-pagination-action {
    padding-top: 15px !important;
}
</style>
