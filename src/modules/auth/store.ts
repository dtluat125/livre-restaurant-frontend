import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import { authService } from './services/api.services';
import { commonService } from '@common/services/api.services';
import { fileService } from '@/common/services/file.service';
import {
    IGoogleLoginLinkParams,
    IUserProfile,
    IGoogleLoginForm,
    IGoogleLoginLinkResponse,
} from './types';
import store from '@/store';
import { useRouter } from 'vue-router';
import { appService } from '@/utils/app';
import { ITokenOption } from '@/utils/token';
import { PageName } from '@/common/constants';
import i18n from '@/plugins/vue-i18n';
import { showAlertMessageFunction } from '@/utils/helper';
import { IProvince, IUser, IUserPosition } from '../user/types';
import { ISelectOptions, IBodyResponse, IGetListResponse } from '@/common/types';

const initUser: IUserProfile = {
    id: NaN,
    address: null,
    birthday: null,
    email: '',
    gender: null,
    fullName: '',
    position: null,
    lastLoginAt: null,
    phoneNumber: null,
    status: null,
    avatarUrl: null,
    avatarId: null,
    provinceId: null,
    isSuperAdmin: false,
};

@Module({ dynamic: true, namespaced: true, store, name: 'auth' })
class AuthModule extends VuexModule {
    googleLoginLink = '';
    loginErrorMessage = '';
    isShowPopupEditProfile = false;
    avatarUrl = '';
    uploadingAvatarUrl = '';
    userProfile: IUserProfile = { ...initUser };
    banks: ISelectOptions[] = [];
    provinceOptions: ISelectOptions[] = [];
    userPositionList: IUserPosition[] = [];
    isDisabledSaveButton = false;

    // GETTERS

    // actions
    @Action
    async loginWithGoogle(data: IGoogleLoginForm) {
        const router = useRouter();
        try {
            const response = await authService.loginWithGoogle(data);
            if (response.success) {
                appService.setUser(response.data?.profile);
                const token: ITokenOption = {
                    accessToken: response.data?.accessToken?.token,
                    refreshToken: response.data?.refreshToken.token,
                    accessTokenExpiredAt: +response.data?.accessToken.expiresIn,
                    refreshTokenExpiredAt: +response?.data?.refreshToken.expiresIn,
                };
                appService.setUserToken(token);
                this.context.dispatch('setLoginUser', response.data?.profile, {
                    root: true,
                });
                router.push({
                    name: PageName.PROFILE_PAGE,
                });
            } else {
                const result = await showAlertMessageFunction(
                    i18n.global.t('auth.login.error.permission.message') as string,
                    i18n.global.t('auth.login.error.permission.title') as string,
                    {
                        confirmButtonText: 'OK',
                    },
                );
                if (result) {
                    router.push({
                        name: PageName.LOGIN_PAGE,
                    });
                }
            }
        } catch (error) {
            router.push({
                name: PageName.LOGIN_PAGE,
            });
        }
    }

    @Action
    async getGoogleLoginLink(params: IGoogleLoginLinkParams) {
        const response = (await authService.getGoogleLoginLink(
            params,
        )) as IBodyResponse<IGoogleLoginLinkResponse>;
        if (response?.success) {
            this.MUTATE_LOGIN_ERROR_MESSAGE('');
            this.MUTATE_GOOGLE_LOGIN_LINK(response.data?.link);
        }
    }

    @Action
    async getProfile() {
        const profile =
            (await authService.getProfile()) as unknown as IBodyResponse<IUserProfile>;
        const avatar = profile.data?.avatarId
            ? await fileService.getFileDetail(profile.data?.avatarId)
            : null;
        const result = {
            ...profile.data,
            avatarUrl: avatar ? avatar.data?.url : null,
        };
        if (profile.success) {
            this.MUTATE_USER_PROFILE(result);
            this.MUTATE_AVATAR_URL(result.avatarUrl as string);
        } else {
            this.MUTATE_USER_PROFILE({ ...initUser });
        }
        return profile;
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
            this.MUTATE_PROVINCE_OPTIONS(provinceOptions);
        }
        return response;
    }

    @Action
    async setUserPositionList(userPositionList: IUserPosition[]) {
        this.MUTATE_USER_POSITION_LIST(userPositionList);
    }

    @Action
    async updateProfile(userData: IUser) {
        const response = await authService.updateProfile(userData);
        return response;
    }

    @Action
    setIsShowPopupEditProfile(value: boolean) {
        this.MUTATE_IS_SHOW_POPUP_EDIT_PROFILE(value);
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
    setUploadingAvatarUrl(url: string) {
        this.MUTATE_UPLOADING_AVATAR_URL(url);
    }

    // MUTATIONS

    @Mutation
    MUTATE_IS_DISABLED_SAVE_BUTTON(isDisabledSaveButton: boolean) {
        this.isDisabledSaveButton = isDisabledSaveButton;
    }

    @Mutation
    MUTATE_USER_PROFILE(userProfile: IUserProfile) {
        this.userProfile = { ...userProfile };
    }

    @Mutation
    MUTATE_BANKS(banks: ISelectOptions[]) {
        this.banks = banks;
    }

    @Mutation
    MUTATE_PROVINCE_OPTIONS(provinceOptions: ISelectOptions[]) {
        this.provinceOptions = provinceOptions;
    }

    @Mutation
    MUTATE_AVATAR_URL(url: string) {
        this.avatarUrl = url;
    }

    @Mutation
    MUTATE_UPLOADING_AVATAR_URL(url: string) {
        this.uploadingAvatarUrl = url;
    }

    @Mutation
    MUTATE_USER_POSITION_LIST(userPositionList: IUserPosition[]) {
        this.userPositionList = userPositionList;
    }

    @Mutation
    MUTATE_IS_SHOW_POPUP_EDIT_PROFILE(value: boolean) {
        this.isShowPopupEditProfile = value;
    }

    @Mutation
    MUTATE_GOOGLE_LOGIN_LINK(data: string) {
        this.googleLoginLink = data;
    }

    @Mutation
    MUTATE_LOGIN_ERROR_MESSAGE(message: string) {
        this.loginErrorMessage = message;
    }
}

export const authModule = getModule(AuthModule);
