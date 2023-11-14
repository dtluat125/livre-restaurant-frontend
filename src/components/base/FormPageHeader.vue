<template>
    <div class="cp-header">
        <!-- Cpanel Left -->
        <div class="cp-left">
            <el-button
                class="filter-exchange header-breadcrumb"
                size="medium"
                @click="onClickBackButton"
            >
                <arrow-left style="width: 1.4em; height: 1.4em; align-items: center" />
            </el-button>
            <h3 class="cp-page-title">{{ pageTitle }}</h3>
        </div>
        <!-- End Cpanel Left -->

        <!-- Cpanel Right -->
        <div class="cp-right">
            <div class="header-buttons">
                <el-button v-if="hasBtnReset" @click="onReset">{{
                    $t('common.app.formPageHeader.button.resetButton')
                }}</el-button>
                <el-button
                    v-if="hasBtnSubmit"
                    class="btn-primary bg-primary"
                    @click="onSubmit"
                    :disabled="isDisabled"
                    style="color: white"
                    >{{ $t('common.app.formPageHeader.button.submitButton') }}</el-button
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from 'vue-property-decorator';
import { ArrowLeft } from '@element-plus/icons-vue';

@Options({
    components: { ArrowLeft },
})
export default class PanelHeader extends Vue {
    @Prop({ default: '' }) readonly pageTitle!: string;
    @Prop({ default: true }) readonly hasBtnReset!: boolean;
    @Prop({ default: true }) readonly hasBtnSubmit!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;

    onClickBackButton(): void {
        this.$emit('on-click-back-button');
    }

    onReset(): void {
        this.$emit('on-reset');
    }

    onSubmit(): void {
        this.$emit('on-submit');
    }
}
</script>

<style scoped lang="scss">
.cp-header {
    background-color: #f7f7f7;
    padding: 18px 20px;
    position: sticky;
    top: 64px;
    z-index: map-get($map: $zIndex, $key: cpHeader);
    @media (min-width: 576px) {
        display: flex;
        justify-content: space-between;
    }
}
.cp-left {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    @media (min-width: 576px) {
        margin-bottom: 0;
    }
}
.cp-page-title {
    font-size: 20px;
    color: #212121;
    font-weight: 400;
    margin: 0;
    margin-right: 15px;
    margin-left: 15px;
}
.cp-right {
    display: flex;
    align-items: center;
}
.filter-exchange {
    width: 36px;
    height: 36px;
    border: 0;
    padding: 0;
    &:hover {
        background-color: #ededed;
        color: black;
    }
}
.btn-primary {
    &:hover {
        background-color: #4fb8f5 !important;
        border-color: #4fb8f5 !important;
    }
}
</style>
