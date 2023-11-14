import { IQueryString } from '@/common/types';
import { PermissionActions, PermissionResources } from './constants';
import { Vue } from 'vue-class-component';

export interface IAction {
    permissionId: number;
    action: PermissionActions;
}
export interface IPermission {
    resource: PermissionResources;
    actions: IAction[];
}

export interface IPermissionAction {
    id: number;
    content: PermissionActions;
}

export interface IPermissionResource {
    id: number;
    content: PermissionResources;
}

export interface IPermissions {
    id: number;
    actionId: number;
    resourceId: number;
    action: IPermissionAction;
    resource: IPermissionResource;
}

export interface IRole {
    id: number | null;
    name: string;
    description: string;
    permissions: IPermissions[];
}

export interface IPermissionTree {
    id?: number;
    name: string;
    resource?: PermissionResources;
    children?: IPermissionTree[];
}

export interface ITreeStatus {
    checkedKeys: string[];
    checkedNodes: IPermissionTree[];
    halfCheckedKeys: string[];
    halfCheckedNodes: IPermissionTree[];
}

export type PermissionTree = Vue & {
    setChecked: (data: IPermissionTree | number, checked: boolean, deep: boolean) => void;
};

export interface IFormCreateRole {
    name: string;
    permissionIds: number[];
    description: string;
}

export type IFormUpdateRole = IFormCreateRole;
export interface IRoleFilterForm {
    keyword?: string | null;
}

export interface IQueryStringRole extends IQueryString, IRoleFilterForm {}
