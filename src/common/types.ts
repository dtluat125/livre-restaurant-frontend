import { AxiosResponse } from 'axios';
import {
    WITH_DELETED_OPTION,
    OrderDirection,
    WITH_INACTIVE_OPTION,
    AcceptStatus,
} from '@/common/constants';
import { Vue } from 'vue-class-component';
import { Component } from 'vue';
import { UserStatus } from '@/modules/user/constants';

// Interfaces for general response of all apis
export interface IBodyResponse<T = Record<string, any>> extends AxiosResponse {
    success: boolean;
    isRequestError?: boolean;
    code: number;
    message: string;
    data: T;
    errors?: {
        key: string;
        errorCode: number;
        message: string;
        rule?: string;
        path?: string;
    }[];
}

export interface IGetListResponse<T> {
    items: T[];
    totalItems: number;
}

// Interfaces for sidebar
export interface ISidebar {
    icon?: string;
    iconComponent?: Component;
    iconLink?: string;
    name?: string;
    to?: string;
    active?: boolean;
    children?: ISidebar[];
    pageName?: string;
    requiredPermissions?: string[];
}

export interface ISelectOptions {
    label: string;
    value: string | number;
}

export interface IQueryString {
    page?: number | null;
    limit?: number | null;
    orderBy?: string | null;
    orderDirection?: OrderDirection | null;
}

export interface IFormatFile {
    size: number;
    originalName: string;
    extension: string;
    mimetype: string;

    isValidSize?: boolean;
    checkingFileType?: {
        isValid: boolean;
        errorMessage: string;
    };
    isTypeNSizeValid?: boolean;
    //
    id?: number;
    success?: boolean;
    url?: string;
    file: File;
}

export interface IRegisterFileParams {
    id?: number;
    path: string;
    fileName: string;
    originalName: string;
    extension: string;
    mimetype: string;
    size: number;
}

export interface IRegisterFileResponse {
    id: number;
    originName: string;
    fileName: string;
    path: string;
    extension: string;
    mimetype: string;
    size: number;
    url: string;
}

export interface IUploadFileToS3Response {
    success: boolean;
    code?: number;
    fileName?: string;
    originalName?: string;
    id?: number;
    url?: string;
}

export interface IPermission {
    read?: boolean;
    readPersonal?: boolean;
    create?: boolean;
    createPersonal?: boolean;
    update?: boolean;
    updatePersonal?: boolean;
    delete?: boolean;
    deletePersonal?: boolean;
    hrRole?: boolean;
    updateStatus?: boolean;
    login?: boolean;
}

export interface IGetPreSignedUrlResponse {
    path: string;
    originalName: string;
    fileName: string;
    presignedUrl: string;
}

export interface IFile {
    id: number;
    fileName: string;
    url: string;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    createdBy?: number | null;
    updatedBy?: number | null;
}

export interface IQueryDropdown {
    page?: number;
    limit?: number;
}

export interface IDropdownUserQuery extends IQueryDropdown {
    status?: UserStatus[];
    withDeleted?: WITH_DELETED_OPTION;
    withInactive?: WITH_INACTIVE_OPTION;
}

export type IContractTypeQueryDropDown = IQueryDropdown;

export interface IDropdownRoleItem {
    id: number;
    name: string;
}

export interface IDropdownUserItem {
    id: number;
    fullName: string;
    status: UserStatus;
}

export interface IContractTypeDropdownDto {
    id: number;
    name: string;
}

export type IMessageType = 'success' | 'info' | 'warning' | 'error';
export interface IPopupAttributes {
    confirmButtonText?: string | undefined;
    cancelButtonText?: string | undefined;
    confirmButtonClass?: string | undefined;
    cancelButtonClass?: string | undefined;
    distinguishCancelAndClose?: boolean | undefined;
    type?: IMessageType | undefined;
    showCancelButton?: boolean | undefined;
}

export type MessageBoxData = 'confirm' | 'close' | 'cancel';

export type INotificationType = '' | 'success' | 'info' | 'warning' | 'error';

export interface ITableRowSelect {
    row: string | number | boolean;
    column: string | number;
    rowIndex: number;
    columnIndex: number;
}

export interface IUploadSuccess {
    success: boolean;
    fileName: string;
    url: string;
}

export interface ISelectForm extends Vue {
    selectWrapper: Record<string, unknown>;
}

export interface IPopupPayload<T> {
    status?: boolean | undefined;
    id?: number | undefined;
    data?: T | undefined;
}
export interface IOrder {
    orderBy?: string;
    orderDirection?: OrderDirection;
}

export interface IImportError {
    column: string;
    errorMessage: string;
    errorCode: string;
}

export interface IImportResponse {
    isValid: boolean;
    errors: IImportError[];
}

export interface IBulkImportResponse {
    results: Record<string, IImportResponse>;
}

export interface IEmitStatus {
    id: number;
    status: AcceptStatus;
}
