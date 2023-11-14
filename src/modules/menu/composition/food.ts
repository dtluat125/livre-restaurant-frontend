import { foodService } from '../../table-diagram/services/api.service';
import { menuModule } from '../store';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { validateFoodSchema } from '../constants';
import { IFood, IFoodCreateBody } from '../types';
import { IBodyResponse } from '@/common/types';
import {
    showConfirmPopUpFunction,
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/utils/helper';
import i18n from '@/plugins/vue-i18n';

export function initData() {
    const { t } = useI18n();
    const initValues = {
        foodImgId: null,
        foodName: '',
        price: 0,
        categoryId: null,
    };
    const isCreate = computed(() => !menuModule.selectedFood?.id);
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateFoodSchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createBody = {
            ...values,
            foodImgId: values.foodImgId as number,
            foodName: values.foodName?.trim(),
            price: values.price,
            categoryId: values.categoryId,
        } as IFoodCreateBody;
        let response;
        const foodId = menuModule.selectedFood?.id;
        const loading = ElLoading.service({
            target: '.food-form',
        });
        if (!isCreate.value) {
            response = await foodService.update(foodId as number, createBody);
        } else {
            response = await foodService.create(createBody);
        }
        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                !isCreate.value
                    ? t('menu.food.message.update.success')
                    : (t('menu.food.message.create.success') as string),
            );
            menuModule.setIsShowFoodFormPopUp(false);
            menuModule.setFoodQueryString({ page: DEFAULT_FIRST_PAGE });
            const loading = ElLoading.service({
                target: '.content',
            });
            await menuModule.getFoods();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                menuModule.setIsShowFoodFormPopUp(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await menuModule.getFoods();
                loading.close();
            }
        }
    });
    const { value: foodImgId } = useField('foodImgId');
    const { value: foodName } = useField('foodName');
    const { value: price } = useField('price');
    const { value: categoryId } = useField('categoryId');

    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({ target: '.food-form-popup' });
            const foodDetail = (await foodService.getDetail(
                menuModule.selectedFood?.id || 0,
            )) as IBodyResponse<IFood>;
            menuModule.setFoodImgUrl(foodDetail?.data?.foodImg?.url as string);
            menuModule.setUploadingFoodImgUrl(foodDetail?.data?.foodImg?.url as string);
            loading.close();
            resetForm({
                values: {
                    foodImgId: foodDetail.data?.foodImgId,
                    foodName: foodDetail.data?.foodName,
                    price: foodDetail.data?.price,
                    categoryId: foodDetail.data?.categoryId,
                },
            });
        } else {
            resetForm({
                values: initValues,
            });
        }
    };
    return {
        errors,
        foodImgId,
        foodName,
        price,
        categoryId,
        isCreate,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}

export const setupDelete = () => {
    const deleteFood = async (id: number) => {
        const isConfirm = await showConfirmPopUpFunction(
            i18n.global.t('menu.food.message.delete.confirmAsk') as string,
            i18n.global.t('menu.food.message.delete.title') as string,
            {},
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await foodService.delete(id);
            loading.close();
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('menu.food.message.delete.success') as string,
                );
                menuModule.setFoodQueryString({
                    page: DEFAULT_FIRST_PAGE,
                });
                const loading = ElLoading.service({
                    target: '.content',
                });
                await menuModule.getFoods();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message);
                if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                    const loading = ElLoading.service({
                        target: '.content',
                    });
                    await menuModule.getFoods();
                    loading.close();
                }
            }
        }
    };

    return { deleteFood };
};
