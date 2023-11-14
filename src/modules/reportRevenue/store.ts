import {
    IReportRevenue,
    IQueryStringReportRevenue,
    IReportRevenueUpdateBody,
} from './types';
import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    LIMIT_PER_PAGE,
} from '@/common/constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { reportRevenueService } from './services/report-revenue.api.services';

const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: LIMIT_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: '',
    payerIds: [],
};

@Module({
    dynamic: true,
    stateFactory: true,
    namespaced: true,
    store,
    name: 'report-revenue',
})
class ReportRevenueModule extends VuexModule {
    reportRevenueList: IReportRevenue[] = [];
    totalReportRevenueList = 0;
    reportRevenueQueryString: IQueryStringReportRevenue = initQueryString;

    isShowReportRevenueFormPopUp = false;
    isDisabledSaveButton = false;
    selectedReportRevenue: IReportRevenueUpdateBody | null = null;

    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(
            PermissionResources.REPORT_REVENUE,
        );
    }

    // actions

    @Action
    async getReportRevenueList() {
        const response = (await reportRevenueService.getList({
            ...this.reportRevenueQueryString,
        })) as IBodyResponse<IGetListResponse<IReportRevenue>>;
        if (response.success) {
            this.MUTATE_REPORT_REVENUE_LIST(response?.data?.items || []);
            this.MUTATE_TOTAL_REPORT_REVENUE(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_REPORT_REVENUE_LIST([]);
            this.MUTATE_TOTAL_REPORT_REVENUE(response?.data?.totalItems || 0);
        }
        return response;
    }

    @Action
    setIsShowReportRevenueFormPopUp(value: boolean) {
        this.MUTATE_IS_SHOW_REPORT_REVENUE_FORM_POP_UP(value);
    }

    @Action
    setIsDisabledSaveButton(value: boolean) {
        this.MUTATE_IS_DISABLED_SAVE_BUTTON(value);
    }

    @Action
    setReportRevenueQueryString(query: IQueryStringReportRevenue) {
        this.MUTATE_REPORT_REVENUE_QUERY_STRING(query);
    }

    @Action
    setSelectedReportRevenue(reportRevenue: IReportRevenueUpdateBody | null) {
        this.MUTATE_SELECTED_REPORT_REVENUE(reportRevenue);
    }

    @Action
    clearQueryString() {
        this.MUTATE_REPORT_REVENUE_QUERY_STRING(initQueryString);
    }

    // MUTATIONS

    @Mutation
    MUTATE_REPORT_REVENUE_LIST(reportRevenue: IReportRevenue[]) {
        this.reportRevenueList = reportRevenue;
    }

    @Mutation
    MUTATE_TOTAL_REPORT_REVENUE(totalReportRevenueList: number) {
        this.totalReportRevenueList = totalReportRevenueList;
    }

    @Mutation
    MUTATE_IS_SHOW_REPORT_REVENUE_FORM_POP_UP(value: boolean) {
        this.isShowReportRevenueFormPopUp = value;
    }

    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(value: boolean) {
        this.isDisabledSaveButton = value;
    }

    @Mutation
    MUTATE_REPORT_REVENUE_QUERY_STRING(query: IQueryStringReportRevenue) {
        this.reportRevenueQueryString = {
            ...this.reportRevenueQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_SELECTED_REPORT_REVENUE(reportRevenue: IReportRevenueUpdateBody | null) {
        this.selectedReportRevenue = reportRevenue;
    }
}

export const reportRevenueModule = getModule(ReportRevenueModule);
