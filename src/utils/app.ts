import { ITokenOption, TokenService } from './token';
import { Storage } from './storage';
import { isStringify } from './util';
import { IUser } from '@/modules/user/types';
import { PermissionResources } from '@/modules/role/constants';

export enum AppEnum {
    USER = 'USER',
    LANG = 'LANG',
}

export const defaultLang = 'en';

class AppService {
    token: TokenService;
    storage: Storage;

    constructor() {
        this.token = new TokenService();
        this.storage = new Storage();
    }

    get currentAppLang() {
        return this.getLang() ? this.getLang() : defaultLang;
    }

    setUser(user: null | IUser): void {
        if (!user) {
            this.storage.setLocalStorage(AppEnum.USER, '');
        }
        if (!isStringify(user)) {
            return;
        }
        this.storage.setLocalStorage(AppEnum.USER, JSON.stringify(user));
    }

    setUserToken(option: ITokenOption) {
        this.token.setAccessToken(option.accessToken);
        this.token.setRefreshToken(option.refreshToken);
        this.token.setAccessTokenExpiredAt(option.accessTokenExpiredAt);
        this.token.setRefreshTokenExpiredAt(option.refreshTokenExpiredAt);
    }

    getTokenOption(): ITokenOption {
        return {
            accessToken: this.token.getAccessToken(),
            refreshToken: this.token.getRefreshToken(),
            accessTokenExpiredAt: this.token.getAccessTokenExpiredAt(),
            refreshTokenExpiredAt: this.token.getRefreshTokenExpiredAt(),
        };
    }

    getUser(): IUser {
        return this.storage.getObjectFromKey(AppEnum.USER) as IUser;
    }

    resetAll() {
        this.token.resetAll();
        this.setUser(null);
        this.setLang(defaultLang);
    }

    getLang() {
        return this.storage.getLocalStorage(AppEnum.LANG);
    }

    setLang(value: string) {
        return this.storage.setLocalStorage(AppEnum.LANG, value);
    }

    getUserPermissionsByResource(resource: PermissionResources): string[] {
        const user = appService.getUser();
        const userPermissions: string[] = [];
        // return array of string action
        // ex: ['user_login', 'user_create',...]
        const value =
            user?.role?.permissions
                .filter((ele) => ele.resource.content === resource)
                .map((ele) => ele.action.content) || [];
        value.forEach((ele) => {
            userPermissions.push(`${resource}_${ele}`);
        });
        return userPermissions;
    }
}

export const appService = new AppService();
