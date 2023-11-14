import UserListPage from './pages/UserListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/user',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.USER_PAGE,
                component: UserListPage,

                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.user',
                            link: '/user',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.USER}_${PermissionActions.READ}`,
                        `${PermissionResources.USER}_${PermissionActions.CREATE}`,
                        `${PermissionResources.USER}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.USER}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
