import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { AxiosPromise } from 'axios';
import { IFormCreateRole, IFormUpdateRole } from '../types';

class RoleApiService extends BaseService {
    getPermission<R extends IBodyResponse>(): AxiosPromise {
        return this.client.get<R>(`${this.detailUrl}/permissions`);
    }

    getRoleById<R extends IBodyResponse>(id: number | string): AxiosPromise {
        return this.client.get<R>(`${this.detailUrl}/${id}`);
    }

    updateRole(id: number, data: IFormUpdateRole): Promise<IBodyResponse> {
        data = this.beforeUpdate<IFormUpdateRole>(data);
        return this.client.patch(`${this.detailUrl}/${id}`, data);
    }

    createRole<R extends IBodyResponse>(data: IFormCreateRole): AxiosPromise {
        data = this.beforeCreate<IFormCreateRole>(data);
        return this.client.post<R>(this.detailUrl, data);
    }
}
export const roleApiService = new RoleApiService({ baseUrl: '/role' }, service);
