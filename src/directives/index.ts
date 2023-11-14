import './sass/popper.scss';
import PopperBasic from './popper';
import { App } from '@vue/runtime-core';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initDirectives = (app: App) => {
    app.directive('popper', new PopperBasic().toJSON());
};
