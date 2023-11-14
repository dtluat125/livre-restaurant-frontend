import { RouteRecordRaw } from 'vue-router';
import FoodPage from './pages/FoodPage.vue';
import CategoryPage from './pages/CategoryPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { PageName } from '@/common/constants';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/food',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.MENU_FOOD_PAGE,
                component: FoodPage,
                meta: {
                    requiresAuth: true,
                    breadcrumb: [
                        {
                            text: 'common.common.breadcrumb.home',
                        },
                        {
                            text: 'common.common.breadcrumb.menu',
                            link: '/menu',
                        },
                    ],
                    requiredPermissions: [
                        `${PermissionResources.MENU_FOOD}_${PermissionActions.READ}`,
                        `${PermissionResources.MENU_FOOD}_${PermissionActions.CREATE}`,
                        `${PermissionResources.MENU_FOOD}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.MENU_FOOD}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
    {
        path: '/category',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.MENU_CATEGORY_PAGE,
                component: CategoryPage,
                meta: {
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.MENU_CATEGORY}_${PermissionActions.READ}`,
                        `${PermissionResources.MENU_CATEGORY}_${PermissionActions.CREATE}`,
                        `${PermissionResources.MENU_CATEGORY}_${PermissionActions.UPDATE}`,
                        `${PermissionResources.MENU_CATEGORY}_${PermissionActions.DELETE}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
