import { IBodyResponse, IGetListResponse } from '@/common/types';
import { AxiosInstance, AxiosPromise } from 'axios';
import { trimObject } from './helper';
import { IGetListParams, IServiceOption } from './types';

export class BaseService {
    client: AxiosInstance;
    baseUrl: string;

    constructor(params: IServiceOption, axios: AxiosInstance) {
        this.client = axios;
        this.baseUrl = params.baseUrl;
    }

    get detailUrl(): string {
        return this.baseUrl;
    }

    get createUrl(): string {
        return this.baseUrl;
    }

    get updateUrl(): string {
        return this.baseUrl;
    }

    get deleteUrl(): string {
        return this.baseUrl;
    }

    useClient(axios: AxiosInstance): void {
        this.client = axios;
    }

    beforeCreate<P>(params: P): P {
        trimObject(params);
        return params;
    }

    beforeUpdate<P>(params: P): P {
        trimObject(params);
        return params;
    }

    beforeSave<P>(params: P): P {
        trimObject(params);
        return params;
    }

    getList<P, R extends IBodyResponse<IGetListResponse<P>>>(
        params: P | IGetListParams,
    ): AxiosPromise {
        return this.client.get<R, R>(this.baseUrl, { params });
    }

    getDetail<R extends IBodyResponse<R>>(id: number): AxiosPromise {
        return this.client.get<R, R>(this.detailUrl + '/' + id);
    }

    create<P>(params: P): Promise<IBodyResponse<P>> {
        params = this.beforeCreate<P>(params);
        return this.client.post(this.createUrl, params);
    }

    update<P>(id: number, params: P): Promise<IBodyResponse<P>> {
        params = this.beforeUpdate<P>(params);
        return this.client.patch(this.updateUrl + '/' + id, params);
    }

    delete<P>(id: number): Promise<IBodyResponse<P>> {
        return this.client.delete(this.deleteUrl + '/' + id);
    }
}
