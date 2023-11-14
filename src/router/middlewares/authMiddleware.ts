import { appService } from '@/utils/app';
import { hasPermissionToAccessRoute } from '@/utils/commonFunction';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export default async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
): Promise<void> => {
    const isPublic = to?.meta?.public || false;
    const isGuest = to?.meta?.isGuest || false;
    const onlyWhenLoggedOut = to?.meta?.onlyWhenLoggedOut || false;
    const loggedIn = !!appService.getTokenOption().accessToken;
    const refreshToken = appService.getTokenOption()?.refreshToken;
    const refreshTokenExpiredAt = +appService.getTokenOption()?.refreshTokenExpiredAt;

    if (isGuest) {
        return next();
    }
    if (isPublic) {
        // Do not allow user to visit entry page if they are logged in
        if (loggedIn && onlyWhenLoggedOut) {
            return next('/');
        }
        return next();
    }
    if (!isPublic && !loggedIn) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
        });
    }
    if (
        !refreshToken ||
        !refreshTokenExpiredAt ||
        refreshTokenExpiredAt <= new Date().getTime()
    ) {
        appService.resetAll();
        return next({
            path: '/login',
            query: { redirect: to.path },
        });
    }
    if (loggedIn) {
        if (appService.getUser().isSuperAdmin) {
            next();
        }
        const requiredPermissions = (to?.meta?.requiredPermissions as string[]) || [];
        if (hasPermissionToAccessRoute(requiredPermissions)) return next();
        return next({ path: '/error/404' });
    }
    return next();
};
