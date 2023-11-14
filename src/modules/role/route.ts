import RoleListPage from './pages/RoleListPage.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PermissionActions, PermissionResources } from './constants';

export default [
    {
        path: '/role',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.ROLE_LIST_PAGE,
                component: RoleListPage,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.role',
                            link: '/role',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.ROLE}_${PermissionActions.READ}`,
                        `${PermissionResources.ROLE}_${PermissionActions.CREATE}`,
                        `${PermissionResources.ROLE}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.ROLE}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
