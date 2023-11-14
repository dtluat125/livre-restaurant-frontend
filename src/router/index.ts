import concat from 'lodash/concat';
import forEach from 'lodash/forEach';
import {
    createRouter,
    createWebHistory,
    NavigationGuardWithThis,
    RouteRecordRaw,
} from 'vue-router';
import { getRouteFromModules } from './util';
import VueRouteMiddleware, { GLOBAL_MIDDLEWARE_NAME } from './middleware';
import AuthMiddleware from './middlewares/authMiddleware';
import { PageName, SpecialPage } from '@/common/constants';
import ErrorLayout from '@/layouts/ErrorLayout.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';

const routesModules = getRouteFromModules();

let routes: Array<RouteRecordRaw> = [
    {
        path: '/error/404',
        component: ErrorLayout,
        name: PageName.NOT_FOUND_PAGE,
        meta: {
            name: SpecialPage.NOT_FOUND,
            requiresAuth: false,
        },
    },

    {
        path: '/guest',
        component: GuestLayout,
        name: PageName.GUEST_PAGE,
        meta: {
            requiresAuth: false,
            isPublic: false,
            isGuest: true,
        },
    },
];

forEach(routesModules, (module) => {
    routes = concat(routes, (module as { default: Array<RouteRecordRaw> }).default);
});

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(
    VueRouteMiddleware({
        [GLOBAL_MIDDLEWARE_NAME]: AuthMiddleware,
    }) as NavigationGuardWithThis<unknown>,
);

export default router;
