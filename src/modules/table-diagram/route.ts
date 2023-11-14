import { RouteRecordRaw } from 'vue-router';
import TableDiagramPage from './pages/TableDiagramPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/table-diagram',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.TABLE_DIAGRAM_PAGE,
                component: TableDiagramPage,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.tableDiagram',
                            link: '/table-diagram',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.TABLE_DIAGRAM}_${PermissionActions.READ}`,
                        `${PermissionResources.TABLE_DIAGRAM}_${PermissionActions.UPDATE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
