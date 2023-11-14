import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import DashboardPage from './pages/DashboardPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';

export default [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                redirect: '/dashboard',
            },
            {
                path: '/dashboard',
                component: DashboardPage,
                name: PageName.DASHBOARD_PAGE,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.dashboard',
                            link: '/dashboard',
                        },
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
