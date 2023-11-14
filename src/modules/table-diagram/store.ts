import { commonService } from '@/common/services/api.services';
import { appModule } from './../../store/app';
import { FloorRestaurant } from './constants';
import { getModule, VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import store from '@/store';
import { tableService } from './services/api.service';
import { ITable, IQueryStringTable } from './types';
import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ORDER_DIRECTION,
    DEFAULT_MAX_SIZE_PER_PAGE,
} from '@/common/constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';
import { DEFAULT_ORDER_BY } from '../user/constants';

const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_MAX_SIZE_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: DEFAULT_ORDER_DIRECTION,
    keyword: null,
    floor: FloorRestaurant.FIRST,
};

@Module({ dynamic: true, namespaced: true, store, name: 'table-restaurant' })
class TableDiagramModule extends VuexModule {
    tableList: Array<ITable> = [];
    tableSelected: ITable | null = null;

    isShowModalTableDetail = false;
    isShowBookingsOfTablePopup = false;
    canChosenTable = false;

    tableQueryString: IQueryStringTable = initQueryString;

    @Mutation
    SET_CAN_CHOSEN_TABLE(data: boolean) {
        this.canChosenTable = data;
    }

    @Mutation
    MUTATE_TABLES_RESTAURANTS(data: Array<ITable>) {
        this.tableList = data;
    }

    @Mutation
    SET_SELECTED_TABLE(data: ITable | null) {
        this.tableSelected = data;
    }

    @Mutation
    MUTATE_EVENT_QUERY_STRING(query: IQueryStringTable) {
        this.tableQueryString = {
            ...this.tableQueryString,
            ...query,
        };
    }

    @Mutation
    MUTATE_IS_SHOW_BOOKINGS_OF_TABLE_POPUP(data: boolean) {
        this.isShowBookingsOfTablePopup = data;
    }

    // ACTION

    @Action
    setTableSelected(data: ITable | null) {
        this.SET_SELECTED_TABLE(data);
    }

    @Action
    setIsShowBookingsOfTablePopup(data: boolean) {
        this.MUTATE_IS_SHOW_BOOKINGS_OF_TABLE_POPUP(data);
    }

    @Action
    setCanChosenTable(data: boolean) {
        this.SET_CAN_CHOSEN_TABLE(data);
    }

    @Action
    clearQueryString() {
        this.MUTATE_EVENT_QUERY_STRING(initQueryString);
    }

    @Action
    setTableQueryString(query: IQueryStringTable) {
        this.MUTATE_EVENT_QUERY_STRING(query);
    }

    // API Table

    @Action
    async getTables() {
        const response = appModule.isGuestPage
            ? ((await commonService.getGuestTableList({
                  ...this.tableQueryString,
              })) as IBodyResponse<IGetListResponse<ITable>>)
            : ((await tableService.getList({
                  ...this.tableQueryString,
              })) as IBodyResponse<IGetListResponse<ITable>>);
        if (response.success) {
            this.MUTATE_TABLES_RESTAURANTS(response?.data?.items || []);
        } else {
            this.MUTATE_TABLES_RESTAURANTS([]);
        }
        return response;
    }
}

export const tableDiagramModule = getModule(TableDiagramModule);
