import ProfilePage from './pages/ProfilePage.vue';
import GoogleLoginPage from './pages/GoogleLoginPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { PageName, SpecialPage } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import { PermissionActions, PermissionResources } from '../role/constants';

export default [
    {
        path: '/google-login',
        component: GoogleLoginPage,
        meta: {
            onlyWhenLoggedOut: true,
            public: true,
        },
    },
    {
        path: '/login',
        component: LoginPage,
        name: PageName.LOGIN_PAGE,
        meta: {
            onlyWhenLoggedOut: true,
            public: true,
        },
    },
    {
        path: '/profile',
        component: MainLayout,
        children: [
            {
                path: '',
                name: PageName.PROFILE_PAGE,
                component: ProfilePage,
                meta: {
                    name: SpecialPage.PROFILE_PAGE,
                    requiresAuth: true,
                    requiredPermissions: [
                        `${PermissionResources.USER}_${PermissionActions.LOGIN}`,
                    ],
                },
            },
        ],
    },
] as RouteRecordRaw[];
