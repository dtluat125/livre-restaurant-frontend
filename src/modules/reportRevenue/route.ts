import ReportRevenuePage from './pages/ReportRevenuePage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/report-revenue',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.REPORT_REPORT_REVENUE_PAGE,
                component: ReportRevenuePage,

                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.reportRevenue',
                            link: '/report-revenue',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.REPORT_REVENUE}_${PermissionActions.READ}`,
                        `${PermissionResources.REPORT_REVENUE}_${PermissionActions.CREATE}`,
                        `${PermissionResources.REPORT_REVENUE}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.REPORT_REVENUE}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
