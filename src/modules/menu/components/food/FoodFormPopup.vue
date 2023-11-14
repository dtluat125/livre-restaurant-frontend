<template>
    <el-dialog
        width="50%"
        v-model="isShowFoodFormPopUp"
        destroy-on-close
        @closed="closePopup"
        @open="form.openPopup"
        custom-class="food-form-popup"
    >
        <template #title>
            <h3 class="text-left">
                {{
                    form.isCreate
                        ? $t('menu.food.foodDialog.titleCreate')
                        : $t('menu.food.foodDialog.titleUpdate')
                }}
            </h3>
        </template>
        <div class="row">
            <div class="col-md-12">
                <BaseUploadAvatar
                    isHorizontal="true"
                    name="avatar"
                    path="avatar"
                    :reset="isShowFoodFormPopUp"
                    :currentImageURL="foodImgUrl"
                    @set-avatar-id="setFoodImgId"
                    @set-avatar-url="setUploadingFoodImgUrl"
                />
            </div>
            <div class="col-md-12">
                <BaseInputText
                    v-model:value="form.foodName"
                    :is-required="true"
                    :placeholder="$t('menu.food.placeholder.foodName')"
                    :label="$t('menu.food.foodPopup.foodName')"
                    :error="translateYupError(form.errors.foodName)"
                />
            </div>
            <div class="col-md-6">
                <BaseInputNumber
                    v-model:value="form.price"
                    :is-required="true"
                    :placeholder="$t('menu.food.placeholder.price')"
                    :label="$t('menu.food.foodPopup.price')"
                    :error="translateYupError(form.errors.price)"
                />
            </div>
            <div class="col-md-6">
                <BaseSingleSelect
                    v-model:value="form.categoryId"
                    is-required="true"
                    :options="categoryOptions"
                    :label="$t('menu.food.foodPopup.category')"
                    :placeholder="$t('menu.food.placeholder.category')"
                    name="category"
                    :filterable="true"
                    :error="translateYupError(form.errors.categoryId)"
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
                            {{ $t('menu.food.button.cancel') }}
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
                            {{ $t('menu.food.button.submit') }}
                        </el-button>
                    </div>
                </div>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { setup } from 'vue-class-component';
import { initData } from '../../composition/food';
import { menuModule } from '../../store';
import { UtilMixins } from '@/mixins/utilMixins';
import { mixins, Options } from 'vue-property-decorator';
import { ISelectOptions } from '@/common/types';
@Options({
    name: 'food-form-popup',
})
export default class MaterialFormPopUp extends mixins(UtilMixins) {
    get isDisabledSaveButton(): boolean {
        return menuModule.isDisabledSaveButton;
    }

    get isShowFoodFormPopUp(): boolean {
        return menuModule.isShowFoodFormPopUp || false;
    }

    set isShowFoodFormPopUp(val: boolean) {
        menuModule.setIsShowFoodFormPopUp(val);
    }

    get foodImgUrl(): string {
        return (
            menuModule?.uploadingFoodImgUrl ||
            require('@/assets/icons/avatar-default.png')
        );
    }

    get categoryOptions(): ISelectOptions[] {
        return menuModule.categoryOptions;
    }

    form = setup(() => initData());

    async closePopup(): Promise<void> {
        menuModule.setUploadingFoodImgUrl('');
        menuModule.setIsShowFoodFormPopUp(false);
        menuModule.setFoodSelected(null);
        (this.form.resetForm as () => void)();
    }

    async onClickSaveButton(): Promise<void> {
        menuModule.setIsDisabledSaveButton(true);
        await this.form.onSubmit();
        menuModule.setIsDisabledSaveButton(false);
    }

    setFoodImgId(fileId: number): void {
        this.form.foodImgId = fileId;
    }

    setUploadingFoodImgUrl(url: string): void {
        menuModule.setUploadingFoodImgUrl(url);
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
