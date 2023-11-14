import { getModule, VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import store from '@/store';
import {
    ICategory,
    IFood,
    ICategoryUpdateBody,
    IQueryStringCategory,
    IQueryStringFood,
    IFoodUpdateBody,
} from './types';
import {
    DEFAULT_FIRST_PAGE,
    LIMIT_PER_PAGE,
    DEFAULT_ORDER_DIRECTION,
} from '@/common/constants';
import { IBodyResponse, IGetListResponse, ISelectOptions } from '@/common/types';
import { DEFAULT_ORDER_BY } from '../user/constants';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import { categoryService, foodService } from './services/api.service';
import { commonService } from '@/common/services/api.services';
import { IProvince } from '../user/types';

const initCategoryQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: null,
};

const initFoodQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: null,
    categories: [],
};

@Module({ dynamic: true, namespaced: true, store, name: 'category' })
class MenuModule extends VuexModule {
    categoryList: Array<ICategory> = [];
    foodList: Array<IFood> = [];

    totalCategories = 0;
    totalFoods = 0;

    selectedFood: IFoodUpdateBody | null = null;
    selectedCategory: ICategoryUpdateBody | null = null;

    isShowModalTableDetail = false;
    idBookingSelected = -1;
    arrivalTimeSelected = -1;
    numberSeatSelected = 0;
    canChosenTable = false;

    categoryQueryString: IQueryStringCategory = initCategoryQueryString;
    foodQueryString: IQueryStringFood = initFoodQueryString;

    isShowCategoryFormPopUp = false;
    isShowFoodFormPopUp = false;

    isDisabledSaveButton = false;
    foodImgUrl = '';
    uploadingFoodImgUrl = '';
    categoryOptions: ISelectOptions[] = [];

    // GETTERS
    get userPermissionsFood(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.MENU_FOOD);
    }

    get userPermissionsCategory(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.MENU_CATEGORY);
    }

    @Mutation
    MUTATE_CATEGORY_LIST(data: Array<ICategory>) {
        this.categoryList = data;
    }

    @Mutation
    MUTATE_TOTAL_CATEGORY(totalCategories: number) {
        this.totalCategories = totalCategories;
    }

    @Mutation
    MUTATE_SELECTED_CATEGORY(data: ICategoryUpdateBody | null) {
        this.selectedCategory = data;
    }

    @Mutation
    MUTATE_FOOD_LIST(data: Array<IFood>) {
        this.foodList = data;
    }

    @Mutation
    MUTATE_TOTAL_FOOD(data: number) {
        this.totalFoods = data;
    }

    @Mutation
    MUTATE_SELECTED_FOOD(data: IFoodUpdateBody | null) {
        this.selectedFood = data;
    }

    @Mutation
    MUTATE_FOOD_QUERY_STRING(query: IQueryStringFood) {
        this.foodQueryString = {
            ...this.foodQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_CATEGORY_QUERY_STRING(query: IQueryStringCategory) {
        this.categoryQueryString = {
            ...this.categoryQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_IS_SHOW_FOOD_FORM_POP_UP(value: boolean) {
        this.isShowFoodFormPopUp = value;
    }

    @Mutation
    MUTATE_IS_SHOW_CATEGORY_FORM_POP_UP(value: boolean) {
        this.isShowCategoryFormPopUp = value;
    }

    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(value: boolean) {
        this.isDisabledSaveButton = value;
    }

    @Mutation
    MUTATE_FOOD_IMG_URL(url: string) {
        this.foodImgUrl = url;
    }

    @Mutation
    MUTATE_UPLOADING_FOOD_IMG_URL(url: string) {
        this.uploadingFoodImgUrl = url;
    }

    @Mutation
    MUTATE_CATEGORY_OPTIONS(categoryOptions: ISelectOptions[]) {
        this.categoryOptions = categoryOptions;
    }

    // ACTION

    @Action
    setCategorySelected(data: ICategoryUpdateBody | null) {
        this.MUTATE_SELECTED_CATEGORY(data);
    }

    @Action
    setFoodSelected(data: IFoodUpdateBody | null) {
        this.MUTATE_SELECTED_FOOD(data);
    }

    @Action
    clearCategoryQueryString() {
        this.MUTATE_CATEGORY_QUERY_STRING(initCategoryQueryString);
    }

    @Action
    clearFoodQueryString() {
        this.MUTATE_FOOD_QUERY_STRING(initFoodQueryString);
    }

    @Action
    setCategoryQueryString(query: IQueryStringCategory) {
        this.MUTATE_CATEGORY_QUERY_STRING(query);
    }

    @Action
    setFoodQueryString(query: IQueryStringFood) {
        this.MUTATE_FOOD_QUERY_STRING(query);
    }

    @Action
    setIsShowCategoryFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_CATEGORY_FORM_POP_UP(value);
    }

    @Action
    setIsShowFoodFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_FOOD_FORM_POP_UP(value);
    }

    @Action
    setIsDisabledSaveButton(value: boolean) {
        this.MUTATE_IS_DISABLED_SAVE_BUTTON(value);
    }

    @Action
    setFoodImgUrl(url: string) {
        this.MUTATE_FOOD_IMG_URL(url);
    }

    @Action
    setUploadingFoodImgUrl(url: string) {
        this.MUTATE_UPLOADING_FOOD_IMG_URL(url);
    }

    // API Table
    @Action
    async getFoods() {
        const response = (await foodService.getList({
            ...this.foodQueryString,
        })) as IBodyResponse<IGetListResponse<IFood>>;
        if (response.success) {
            this.MUTATE_FOOD_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_FOOD(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_FOOD_LIST([]);
            this.MUTATE_TOTAL_FOOD(0);
        }
        return response;
    }

    @Action
    async getCategories() {
        const response = (await categoryService.getList({
            ...this.categoryQueryString,
        })) as IBodyResponse<IGetListResponse<ICategory>>;
        if (response.success) {
            this.MUTATE_CATEGORY_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_CATEGORY(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_CATEGORY_LIST([]);
            this.MUTATE_TOTAL_CATEGORY(0);
        }
        return response;
    }

    @Action
    async getDropdownCategories(): Promise<IBodyResponse<IGetListResponse<IProvince>>> {
        const response = await commonService.getDropdownCategories();
        if (response?.success) {
            const categoryOptions: ISelectOptions[] = response?.data?.items.map(
                (category) => {
                    return {
                        value: category.id as number,
                        label: category.name,
                    };
                },
            );
            this.MUTATE_CATEGORY_OPTIONS(categoryOptions);
        }
        return response;
    }
}

export const menuModule = getModule(MenuModule);
