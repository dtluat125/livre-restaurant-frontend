import BillingPage from './pages/BillingPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/billing',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.BILLING_PAGE,
                component: BillingPage,

                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.billing',
                            link: '/billing',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.BILLING}_${PermissionActions.READ}`,
                        `${PermissionResources.BILLING}_${PermissionActions.CREATE}`,
                        `${PermissionResources.BILLING}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.BILLING}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
