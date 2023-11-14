import yup from '@/plugins/yup';
import { INPUT_TEXT_MAX_LENGTH } from '@/common/constants';

export enum PermissionResources {
    DASHBOARD = 'dashboard',
    USER = 'user',
    TABLE_DIAGRAM = 'table_diagram',
    BOOKING = 'booking',
    MENU_FOOD = 'food',
    MENU_CATEGORY = 'category',
    BILLING = 'billing',
    REPORT_REVENUE = 'report_revenue',
    ROLE = 'role',
    CHEF = 'chef',
}

export enum PermissionActions {
    READ = 'read',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    UPDATE_ROLE = 'update_role',
    APPROVE_STATUS = 'approve_status',
}

export const personalPermissionSuffix = '_personal';

export const permissionSchema = yup.object({
    description: yup.string().trim().nullable().max(INPUT_TEXT_MAX_LENGTH),
    name: yup.string().trim().max(INPUT_TEXT_MAX_LENGTH).label('roleName').required(),
    permissionIds: yup.array().min(1, 'role.list.common.error.noPermission').required(),
});

export const permissions = [
    {
        model: 'user',
        actions: ['read', 'create', 'update', 'delete', 'change_status'],
    },
    {
        model: 'role',
        actions: ['read', 'update'],
    },
];

export const PERMISSION_LOGIN = 'login';

export const LOADING_BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.9)';
