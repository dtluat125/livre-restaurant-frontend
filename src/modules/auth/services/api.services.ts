import { IGoogleLoginLinkParams, IGoogleLoginForm, ILoginResponse } from '../types';
import { IBodyResponse } from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class AuthApiService extends BaseService {
    get updateUrl() {
        return this.baseUrl + '/profile';
    }

    getGoogleLoginLink(params: IGoogleLoginLinkParams) {
        const getLoginLinkUrl = `${this.baseUrl}/google-login-link`;
        return this.client.get(getLoginLinkUrl, { params });
    }

    loginWithGoogle(data: IGoogleLoginForm) {
        const getLoginLinkUrl = `${this.baseUrl}/google-login`;
        data = this.beforeSave<IGoogleLoginForm>(data);
        return this.client.post<ILoginResponse, IBodyResponse<ILoginResponse>>(
            getLoginLinkUrl,
            data,
        );
    }

    getProfile() {
        return this.client.get(this.detailUrl + '/profile');
    }

    updateProfile<P>(params: P): Promise<IBodyResponse> {
        params = this.beforeUpdate<P>(params);
        return this.client.patch(this.updateUrl, params);
    }
}
export const authService = new AuthApiService({ baseUrl: '/auth' }, service);
