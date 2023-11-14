import { IUser, IUserPosition } from '@/modules/user/types';
export interface ILoginResponse {
    accessToken: {
        token: string;
        expiresIn: string;
    };
    refreshToken: {
        token: string;
        expiresIn: string;
    };
    profile: IUser;
}

export interface IGoogleLoginLinkParams {
    redirectUri: string;
    state?: string;
}
export interface IGoogleLoginForm {
    redirectUri?: string;
    code: string | (string | null)[];
}
export interface IGoogleLoginLinkResponse {
    link: string;
    redirectUri: string;
}

export interface IUserProfile {
    id: number | null;
    address: string | null;
    birthday: string | null;
    email: string;
    status: string | null;
    gender: string | null;
    fullName: string;
    position: IUserPosition | null | string;
    lastLoginAt: string | null;
    phoneNumber: string | null;
    avatarUrl: string | null;
    avatarId: number | null;
    provinceId: number | null;
    isSuperAdmin: boolean;
}

export interface IOption {
    label: string | null;
    value: number | string;
}
