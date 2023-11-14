import { categoryService } from './../../table-diagram/services/api.service';
import { menuModule } from '../store';
import { useField, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ElLoading } from 'element-plus';
import { DEFAULT_FIRST_PAGE, HttpStatus } from '@/common/constants';
import { validateCategorySchema } from '../constants';
import { ICategory, ICategoryCreateBody } from '../types';
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
        name: '',
        priority: undefined,
        note: '',
    };
    const isCreate = computed(() => !menuModule.selectedCategory?.id);
    const { handleSubmit, errors, resetForm, validate } = useForm({
        initialValues: initValues,
        validationSchema: validateCategorySchema,
    });

    const onSubmit = handleSubmit(async (values) => {
        const createBody = {
            ...values,
            name: values.name,
            priority: values.priority,
            note: values.note?.trim(),
        } as ICategoryCreateBody;
        let response;
        const categoryId = menuModule.selectedCategory?.id;
        const loading = ElLoading.service({
            target: '.category-form',
        });
        if (!isCreate.value) {
            response = await categoryService.update(categoryId as number, createBody);
        } else {
            response = await categoryService.create(createBody);
        }
        loading.close();
        if (response.success) {
            showSuccessNotificationFunction(
                !isCreate.value
                    ? t('menu.category.message.update.success')
                    : (t('menu.category.message.create.success') as string),
            );
            menuModule.setIsShowCategoryFormPopUp(false);
            menuModule.setCategoryQueryString({ page: DEFAULT_FIRST_PAGE });
            const loading = ElLoading.service({
                target: '.content',
            });
            await menuModule.getCategories();
            loading.close();
        } else {
            showErrorNotificationFunction(response.message as string);
            if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                menuModule.setIsShowCategoryFormPopUp(false);
                const loading = ElLoading.service({
                    target: '.content',
                });
                await menuModule.getCategories();
                loading.close();
            }
        }
    });
    const { value: name } = useField('name');
    const { value: priority } = useField('priority');
    const { value: note } = useField('note');

    const openPopup = async () => {
        if (!isCreate.value) {
            const loading = ElLoading.service({ target: '.category-form-popup' });
            const categoryDetail = (await categoryService.getDetail(
                menuModule.selectedCategory?.id || 0,
            )) as IBodyResponse<ICategory>;
            loading.close();
            resetForm({
                values: {
                    name: categoryDetail.data?.name,
                    priority: categoryDetail.data?.priority,
                    note: categoryDetail.data?.note,
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
        name,
        priority,
        note,
        isCreate,
        validate,
        openPopup,
        onSubmit,
        resetForm,
    };
}

export const setupDelete = () => {
    const deleteCategory = async (id: number) => {
        const isConfirm = await showConfirmPopUpFunction(
            i18n.global.t('menu.category.message.delete.confirmAsk') as string,
            i18n.global.t('menu.category.message.delete.title') as string,
            {},
        );
        if (isConfirm) {
            const loading = ElLoading.service({
                target: '.content',
            });
            const response = await categoryService.delete(id);
            loading.close();
            if (response.success) {
                showSuccessNotificationFunction(
                    i18n.global.t('menu.category.message.delete.success') as string,
                );
                menuModule.setCategoryQueryString({
                    page: DEFAULT_FIRST_PAGE,
                });
                const loading = ElLoading.service({
                    target: '.content',
                });
                await menuModule.getCategories();
                loading.close();
            } else {
                showErrorNotificationFunction(response.message);
                if (response.code === HttpStatus.ITEM_NOT_FOUND) {
                    const loading = ElLoading.service({
                        target: '.content',
                    });
                    await menuModule.getCategories();
                    loading.close();
                }
            }
        }
    };

    return { deleteCategory };
};
