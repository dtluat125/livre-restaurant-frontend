import { IQueryString } from '@/common/types';
import { SettingKey, UserGender, UserRole, UserStatus } from './constants';
import { IRole } from '../role/types';
import { SupportLanguage } from '@/common/constants';

export type IUserPosition = {
    code: string;
    value: Record<SupportLanguage, string>;
    inUse?: boolean;
};

export interface IGeneralSetting<T> {
    key: SettingKey;
    values: T[];
}

export interface IGetGeneralSettingQuery {
    key: string;
}
export interface IProvince {
    id: number;
    name: string;
}
export interface IUserFinger {
    userId: number;
    fingerId: number;
}

export interface IUserUpload {
    id: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
}

export interface IAvatar {
    fileName: string | null;
    avatarId: number | null;
    url: string | null;
}

export interface IUser {
    id: number;
    status: UserStatus;
    position: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    birthday?: string | Date | null;
    gender?: UserGender | null;
    roleId: number | null;
    provinceId?: number | null;
    address?: string | null;
    avatarId?: number | null;
    note?: string | null;
    lastLoginAt: Date | string | null;
    role: IRole;
    province?: IProvince | null;
    avatar?: IAvatar | null;
    isSuperAdmin: boolean;
    createdAt: Date | string | null;
    updatedAt: Date | string | null;
    createdBy: number | null;
    updatedBy: number | null;
}

export interface IUserFilterForm {
    keyword?: string | null;
    statuses?: UserStatus[] | null;
    genders?: UserGender[] | null;
    roles?: UserRole[] | null;
    provinces?: number[] | null;
    positions?: string[] | null;
}

export interface IQueryStringUser extends IQueryString, IUserFilterForm {}

export interface IUserUpdate {
    email?: string;
    fullName: string;
    phoneNumber: string | null;
    birthday?: string | Date | null;
    gender?: UserGender | null;
    roleId: number | null;
    position: string;
    address?: string | null;
    avatarId?: number | null;
}
