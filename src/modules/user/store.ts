import {
    IProvince,
    IUser,
    IQueryStringUser,
    IUserFilterForm,
    IUserPosition,
} from '@/modules/user/types';
import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import {
    IBodyResponse,
    IGetListResponse,
    IOrder,
    ISelectOptions,
    IDropdownRoleItem,
} from '@/common/types';
import { DEFAULT_FIRST_PAGE, DEFAULT_ORDER_BY, OrderDirection } from '@/common/constants';
import { UserStatus, USERS_SIZE_PER_PAGE } from './constants';
import { userApiService } from './services/api.service';
import store from '@/store';
import { commonService } from '@/common/services/api.services';
import { appService } from '@/utils/app';
import { PermissionResources } from '../role/constants';
import { capitalize } from 'lodash';

const initQueryString = {
    page: DEFAULT_FIRST_PAGE,
    limit: USERS_SIZE_PER_PAGE,
    orderBy: DEFAULT_ORDER_BY,
    orderDirection: OrderDirection.DESC,
    keyword: null,
    roles: [],
    statuses: [],
    genders: [],
} as IQueryStringUser;
@Module({ dynamic: true, namespaced: true, store, name: 'user' })
class UserModule extends VuexModule {
    avatarUrl = '';
    userPositionList: IUserPosition[] = [];
    roleOptions: Record<string, string | number>[] = [];
    users: IUser[] = [];
    banks: ISelectOptions[] = [];
    provinceOptions: ISelectOptions[] = [];
    totalUsers = 0;
    isShowUserFormPopup = false;
    queryString: IQueryStringUser = initQueryString;

    isDisabledSaveButton = false;

    selectedUser: IUser | null = null;
    isOpenImportUserFilePopup = false;
    isOpenUploadFingerFilePopup = false;

    isOpenImportUserResultPopUp = false;

    // GETTERS
    get userPermissions(): string[] {
        const userPermissions = appService.getUserPermissionsByResource(
            PermissionResources.USER,
        );
        const rolePermissions = appService.getUserPermissionsByResource(
            PermissionResources.ROLE,
        );
        return [...userPermissions, ...rolePermissions];
    }

    get getIsOpenUploadFingerFilePopup(): boolean {
        return this.isOpenUploadFingerFilePopup;
    }

    // ACTION
    @Action
    async getUsers(): Promise<IBodyResponse<IGetListResponse<IUser>>> {
        const response = (await userApiService.getList(
            this.queryString,
        )) as IBodyResponse<IGetListResponse<IUser>>;
        if (response?.success) {
            this.MUTATE_USERS(response?.data?.items || []);
            this.MUTATE_TOTAL_USERS(response?.data?.totalItems || 0);
        } else {
            this.MUTATE_USERS([]);
            this.MUTATE_TOTAL_USERS(0);
        }
        return response;
    }

    @Action
    clearQueryString() {
        this.MUTATE_QUERY_STRING(initQueryString);
    }

    @Action
    async setUserPositionList(userPositionList: IUserPosition[]) {
        this.MUTATE_SET_USER_POSITION_LIST(userPositionList);
    }

    @Action
    async getProvinceList(): Promise<IBodyResponse<IGetListResponse<IProvince>>> {
        const response = await commonService.getProvinces();
        if (response?.success) {
            const provinceOptions: ISelectOptions[] = response?.data?.items.map(
                (province) => {
                    return {
                        value: province.id as number,
                        label: province.name,
                    };
                },
            );
            this.MUTATE_PROVINCES_OPTIONS(provinceOptions);
        }
        return response;
    }

    @Action
    async getRoleOptions(): Promise<IBodyResponse<IGetListResponse<IDropdownRoleItem>>> {
        const response = await commonService.getDropdownRoles();
        if (response?.success) {
            const roleOptions: { value: number; label: string }[] = [];
            (response?.data?.items || []).forEach((role) => {
                roleOptions.push({
                    value: role.id as number,
                    label: capitalize(role.name as string),
                });
            });
            this.MUTATE_SET_ROLE_OPTIONS(roleOptions);
            return response;
        }
        this.MUTATE_SET_ROLE_OPTIONS([]);
        return response;
    }

    @Action
    async updateStatus({ id, status }: Record<string, number | UserStatus>) {
        const response = (await userApiService.updateStatus(id as number, {
            status,
        })) as IBodyResponse<IUser>;

        return response;
    }

    @Action
    async deleteUser(id: number) {
        const response = await userApiService.delete(id);

        return response;
    }

    @Action
    setPage(page: number) {
        this.MUTATE_PAGE(page);
    }

    @Action
    setOrder({ orderBy, orderDirection }: IOrder) {
        if (orderBy && orderDirection) {
            this.MUTATE_ORDER({ orderBy, orderDirection });
        } else {
            this.MUTATE_ORDER({});
        }
    }

    @Action
    setFilterForm(filter: IUserFilterForm) {
        this.MUTATE_FILTER_FORM(filter);
    }

    @Action
    async setSelectedUser(selectedUser: IUser | null) {
        this.MUTATE_SELECTED_USER(selectedUser);
    }

    @Action
    async setIsShowUserFormPopup(isShowUserFormPopup: boolean) {
        this.MUTATE_IS_SHOW_USER_FORM_POPUP(isShowUserFormPopup);
    }

    @Action
    resetQueryString() {
        this.MUTATE_QUERY_STRING(initQueryString);
    }

    @Action
    setQueryString(queryString: IQueryStringUser) {
        this.MUTATE_QUERY_STRING({
            ...this.queryString,
            ...queryString,
        });
    }

    @Action
    setIsOpenImportUserFilePopup(value: boolean) {
        this.MUTATE_IS_OPEN_IMPORT_USER_FILE_POPUP(value);
    }

    @Action
    setIsOpenUploadFingerFilePopup(value: boolean) {
        this.MUTATE_IS_OPEN_UPLOAD_FINGER_FILE_POPUP(value);
    }

    @Action
    setIsDisabledSaveButton(value: boolean) {
        this.MUTATE_IS_DISABLED_SAVE_BUTTON(value);
    }

    @Action
    setAvatarUrl(url: string) {
        this.MUTATE_AVATAR_URL(url);
    }

    @Action
    setIsOpenImportUserResultPopup(value: boolean) {
        this.MUTATE_IS_OPEN_IMPORT_USER_RESULT_POP_UP(value);
    }

    // MUTATION
    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(isDisabledSaveButton: boolean) {
        this.isDisabledSaveButton = isDisabledSaveButton;
    }

    @Mutation
    MUTATE_SET_USER_POSITION_LIST(userPositionList: IUserPosition[]) {
        this.userPositionList = userPositionList;
    }

    @Mutation
    MUTATE_SET_ROLE_OPTIONS(roleOptions: Record<string, string | number>[]) {
        this.roleOptions = roleOptions;
    }

    @Mutation
    MUTATE_USERS(users: IUser[]) {
        this.users = users;
    }

    @Mutation
    MUTATE_BANKS(banks: ISelectOptions[]) {
        this.banks = banks;
    }

    @Mutation
    MUTATE_PROVINCES_OPTIONS(provinceOptions: ISelectOptions[]) {
        this.provinceOptions = provinceOptions;
    }

    @Mutation
    MUTATE_TOTAL_USERS(totalUsers: number) {
        this.totalUsers = totalUsers;
    }

    @Mutation
    MUTATE_PAGE(page: number) {
        this.queryString.page = page;
    }

    @Mutation
    MUTATE_ORDER(order: IOrder) {
        this.queryString.orderBy = order.orderBy || null;
        this.queryString.orderDirection = order.orderDirection || null;
    }

    @Mutation
    MUTATE_FILTER_FORM(filter: IUserFilterForm) {
        this.queryString.keyword = filter.keyword?.trim() || null;
        this.queryString.statuses = filter.statuses || null;
        this.queryString.genders = filter.genders || null;
        this.queryString.roles = filter.roles || null;
        this.queryString.provinces = filter.provinces || null;
        this.queryString.positions = filter.positions || null;
    }

    @Mutation
    MUTATE_SELECTED_USER(selectedUser: IUser | null) {
        this.selectedUser = selectedUser || null;
    }

    @Mutation
    MUTATE_IS_SHOW_USER_FORM_POPUP(isShowUserFormPopup: boolean) {
        this.isShowUserFormPopup = isShowUserFormPopup;
    }

    @Mutation
    MUTATE_QUERY_STRING(queryString: IQueryStringUser) {
        this.queryString = { ...queryString };
    }

    @Mutation
    MUTATE_IS_OPEN_IMPORT_USER_FILE_POPUP(value: boolean) {
        this.isOpenImportUserFilePopup = value;
    }

    @Mutation
    MUTATE_IS_OPEN_UPLOAD_FINGER_FILE_POPUP(value: boolean) {
        this.isOpenUploadFingerFilePopup = value;
    }

    @Mutation
    MUTATE_AVATAR_URL(url: string) {
        this.avatarUrl = url;
    }

    @Mutation
    MUTATE_IS_OPEN_IMPORT_USER_RESULT_POP_UP(value: boolean) {
        this.isOpenImportUserResultPopUp = value;
    }
}

export const userModule = getModule(UserModule);
