<template>
    <el-dialog
        width="50%"
        v-model="isShowCategoryFormPopUp"
        destroy-on-close
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="category-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    form.isCreate
                        ? $t('menu.category.categoryDialog.titleCreate')
                        : $t('menu.category.categoryDialog.titleUpdate')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-12">
                <BaseInputText
                    v-model:value="form.name"
                    :is-required="true"
                    :placeholder="$t('menu.category.placeholder.categoryName')"
                    :label="$t('menu.category.categoryPopup.categoryName')"
                    :error="translateYupError(form.errors.name)"
                />
            </div>
            <div class="col-md-6">
                <BaseInputNumber
                    v-model:value="form.priority"
                    :is-required="true"
                    :placeholder="$t('menu.category.placeholder.priority')"
                    :label="$t('menu.category.categoryPopup.priority')"
                    :error="translateYupError(form.errors.priority)"
                />
            </div>
            <div class="col-md-6">
                <BaseInputText
                    v-model:value="form.note"
                    :error="translateYupError(form.errors.note)"
                    :label="$t('menu.category.categoryPopup.note')"
                    :placeholder="$t('menu.category.placeholder.note')"
                />
            </div>
        </div>
        <table-diagram />
        <template #footer>
            <span class="dialog-footer">
                <div class="row justify-content-center footer">
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-end justify-content-center"
                    >
                        <el-button @click="closePopup">
                            {{ $t('menu.category.button.cancel') }}
                        </el-button>
                    </div>
                    <div
                        class="col-md-4 col-sm-6 d-flex justify-content-md-start justify-content-center"
                    >
                        <el-button
                            type="primary"
                            @click="onClickSaveButton"
                            :disabled="isDisabledSaveButton"
                        >
                            {{ $t('menu.category.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { setup } from 'vue-class-component';
import { initData } from '../../composition/category';
import { menuModule } from '../../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins, Options } from 'vue-property-decorator';
@Options({
    name: 'category-form-popup',
})
export default class MaterialFormPopUp extends mixins(UtilMixins) {
    get isDisabledSaveButton(): boolean {
        return menuModule.isDisabledSaveButton;
    }

    get isShowCategoryFormPopUp(): boolean {
        return menuModule.isShowCategoryFormPopUp || false;
    }

    set isShowCategoryFormPopUp(val: boolean) {
        menuModule.setIsShowCategoryFormPopUp(val);
    }

    form = setup(() => initData());

    async closePopup(): Promise<void> {
        menuModule.setIsShowCategoryFormPopUp(false);
        menuModule.setCategorySelected(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        menuModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        menuModule.setIsDisabledSaveButton(false);
    }
}
</script>
<style lang="scss" scoped>
@media (max-width: 1199.98px) {
    :deep(.el-dialog) {
        width: 80%;
    }
}
.text-left {
    text-align: left;
}

:deep(.el-input-number .el-input__inner) {
    width: 100%;
    margin-bottom: 15px;
    height: 36px !important;
}
</style>
