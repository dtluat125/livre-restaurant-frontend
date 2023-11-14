import { RouteRecordRaw } from 'vue-router';
import BookingPage from './pages/BookingPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/booking',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.BOOKING_PAGE,
                component: BookingPage,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.booking',
                            link: '/booking',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.BOOKING}_${PermissionActions.READ}`,
                        `${PermissionResources.BOOKING}_${PermissionActions.CREATE}`,
                        `${PermissionResources.BOOKING}_${PermissionActions.UPDATE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
