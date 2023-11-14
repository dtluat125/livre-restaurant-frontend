import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
    IBilling,
    IBillingUpdate,
    IFoodBilling,
    IQueryStringBilling,
    IQueryStringFoodBilling,
} from './types';
import { billingService, foodBillingApiService } from './services/api.services';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_MAX_SIZE_PER_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    LIMIT_PER_PAGE,
} from '@/common/constants';

const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: '',
};

const initFoodBookingQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_MAX_SIZE_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: '',
    billingId: undefined,
};

@Module({ dynamic: true, stateFactory: true, namespaced: true, store, name: 'billing' })
class BillingModule extends VuexModule {
    // billing
    billingList: IBilling[] = [];
    totalBillings = 0;
    billingQueryString: IQueryStringBilling = initQueryString;
    isShowBillingFormPopUp = false;
    selectedBilling: IBillingUpdate | null = null;

    // food-billing
    foodBillingList: IFoodBilling[] = [];
    totalFoodBillings = 0;
    foodBillingQueryString: IQueryStringFoodBilling = initFoodBookingQueryString;

    paymentTotal = 0;

    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.BILLING);
    }

    // actions

    @Action
    async getBillingList(): Promise<IBodyResponse<IGetListResponse<IBilling>>> {
        const response = (await billingService.getList({
            ...this.billingQueryString,
        })) as IBodyResponse<IGetListResponse<IBilling>>;
        if (response.success) {
            this.MUTATE_BILLING_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_BILLING(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_BILLING_LIST([]);
            this.MUTATE_TOTAL_BILLING(0);
        }
        return response;
    }

    @Action
    async getFoodBillingList(): Promise<IBodyResponse<IGetListResponse<IFoodBilling>>> {
        this.MUTATE_FOOD_BILLING_QUERY_STRING({
            billingId: this.selectedBilling?.id,
        });
        const response = (await foodBillingApiService.getList({
            ...this.foodBillingQueryString,
        })) as IBodyResponse<IGetListResponse<IFoodBilling>>;
        if (response.success) {
            this.MUTATE_FOOD_BILLING_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_FOOD_BILLING(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_FOOD_BILLING_LIST([]);
            this.MUTATE_TOTAL_FOOD_BILLING(0);
        }
        return response;
    }

    @Action
    setIsShowBillingFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_BILLING_FORM_POP_UP(value);
    }

    @Action
    setPaymentTotal(value: number) {
        this.MUTATE_PAYMENT_TOTAL(value);
    }

    @Action
    setBillingQueryString(query: IQueryStringBilling) {
        this.MUTATE_BILLING_QUERY_STRING(query);
    }

    @Action
    setFoodBillingQueryString(query: IQueryStringFoodBilling) {
        this.MUTATE_FOOD_BILLING_QUERY_STRING(query);
    }

    @Action
    setSelectedBilling(billing: IBillingUpdate | null) {
        this.MUTATE_SELECTED_BILLING(billing);
    }

    @Action
    clearBillingQueryString() {
        this.MUTATE_BILLING_QUERY_STRING(initQueryString);
    }

    @Action
    clearFoodBillingQueryString() {
        this.MUTATE_FOOD_BILLING_QUERY_STRING(initFoodBookingQueryString);
    }

    // MUTATIONS

    @Mutation
    MUTATE_BILLING_LIST(billings: IBilling[]) {
        this.billingList = billings;
    }

    @Mutation
    MUTATE_FOOD_BILLING_LIST(billings: IFoodBilling[]) {
        this.foodBillingList = billings;
    }

    @Mutation
    MUTATE_TOTAL_BILLING(totalBillings: number) {
        this.totalBillings = totalBillings;
    }

    @Mutation
    MUTATE_PAYMENT_TOTAL(data: number) {
        this.paymentTotal = data;
    }

    @Mutation
    MUTATE_TOTAL_FOOD_BILLING(totals: number) {
        this.totalFoodBillings = totals;
    }

    @Mutation
    MUTATE_IS_SHOW_BILLING_FORM_POP_UP(value: boolean) {
        this.isShowBillingFormPopUp = value;
    }

    @Mutation
    MUTATE_BILLING_QUERY_STRING(query: IQueryStringBilling) {
        this.billingQueryString = {
            ...this.billingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_FOOD_BILLING_QUERY_STRING(query: IQueryStringFoodBilling) {
        this.foodBillingQueryString = {
            ...this.foodBillingQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_SELECTED_BILLING(billing: IBillingUpdate | null) {
        this.selectedBilling = billing;
    }
}

export const billingModule = getModule(BillingModule);
