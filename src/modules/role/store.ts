import { getModule, VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import store from '@/store';

import { IRole, IPermission } from './types';
import { roleApiService } from './services/api.service';
import { appService } from '@/utils/app';
import { PermissionResources } from './constants';
import { IBodyResponse, IGetListResponse } from '@/common/types';

@Module({ dynamic: true, namespaced: true, store, name: 'Role' })
class Role extends VuexModule {
    roles: IRole[] = [];

    initRole = {
        id: NaN,
        name: '',
        description: '',
        permissions: [],
    };

    role: IRole = { ...this.initRole };

    permissionList: IPermission[] = [];

    // GETTERS
    get userPermissions(): string[] {
        return appService.getUserPermissionsByResource(PermissionResources.ROLE);
    }

    // ACTIONS
    @Action
    setRole(value: IRole) {
        this.MUTATE_SET_ROLE(value);
    }

    @Action
    async getRole(id: number) {
        const response = await roleApiService.getRoleById(id);
        if (response.data) {
            this.setRole(response.data);
        } else {
            this.setRole({ ...this.initRole });
        }
    }

    @Action
    async getRoles(): Promise<IBodyResponse<IGetListResponse<IRole>>> {
        const response = (await roleApiService.getList({})) as IBodyResponse<
            IGetListResponse<IRole>
        >;
        if (response.success) {
            await this.MUTATE_ROLES(response?.data?.items);
        }
        return response;
    }

    @Action
    setPermissionList(value: IPermission[]) {
        this.MUTATE_SET_PERMISSION_LIST(value);
    }

    @Action
    async getPermissionList() {
        const response = await roleApiService.getPermission();
        if (response.data) {
            this.setPermissionList(response.data.items);
        } else {
            this.setPermissionList([]);
        }
    }
    // MUTATIONS

    @Mutation
    MUTATE_ROLES(roles: IRole[]) {
        this.roles = roles;
    }

    @Mutation
    MUTATE_SET_ROLE(value: IRole) {
        this.role = value;
    }

    @Mutation
    MUTATE_SET_PERMISSION_LIST(value: IPermission[]) {
        this.permissionList = value;
    }
}

export const roleModule = getModule(Role);
