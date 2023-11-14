import LocalStorage from '@/utils/localStorage';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpMiddleware } from './httpMiddleware';
import { appModule } from '@/store/app';
export default class AuthMiddleware extends HttpMiddleware {
    async onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        config.headers['accept-language'] = LocalStorage.getLang();
        return config;
    }

    onResponse(response: AxiosResponse): AxiosResponse {
        if (typeof response?.data === 'string') response.data = JSON.parse(response.data);
        response.data.success = true;
        return response.data;
    }

    onResponseError(error: AxiosError): void {
        if (error.response) {
            if (typeof error?.response?.data === 'string') {
                error.response.data = JSON.parse(error.response.data);
            }
            error.response.data = {
                ...(error?.response?.data || {}),
                success: false,
            };
            return error.response.data;
        } else if (error.request) {
            error.request.data = {
                ...(error?.request?.data || {}),
                success: false,
                isRequestError: true,
                message: error.message,
            };
            // show network error
            if (!appModule.isShowNetworkError) {
                appModule.SET_SHOW_NETWORK_ERROR(true);
            }
            return error.request?.data;
        }
        throw error;
    }
}
