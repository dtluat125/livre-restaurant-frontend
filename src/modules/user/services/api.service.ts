import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IBodyResponse } from '@common/types';
import { AxiosPromise } from 'axios';
import { IGeneralSetting, IGetGeneralSettingQuery, IUserPosition } from '../types';

class UserApiService extends BaseService {
    updateStatus<P>(id: number, data: P): AxiosPromise {
        data = this.beforeUpdate<P>(data);
        return this.client.patch<P, IBodyResponse<P>>(
            `${this.detailUrl}/${id}/status`,
            data,
        );
    }
}

export const userApiService = new UserApiService({ baseUrl: '/user' }, service);
export const userFingerUpdateApiService = new UserApiService(
    { baseUrl: '/user/update-finger-id' },
    service,
);

class SettingApiService extends BaseService {
    async getGeneralSetting(query: IGetGeneralSettingQuery) {
        return await this.client.get<
            IGeneralSetting<IUserPosition>,
            IBodyResponse<IGeneralSetting<IUserPosition>>
        >(`${this.detailUrl}?key=${query.key}`);
    }

    async saveGeneralSetting(data: IGeneralSetting<IUserPosition | string>) {
        data = this.beforeSave<IGeneralSetting<IUserPosition | string>>(data);
        return await this.client.post(`${this.detailUrl}`, data);
    }
}

export const generalSettingApiService = new SettingApiService(
    { baseUrl: '/setting' },
    service,
);
