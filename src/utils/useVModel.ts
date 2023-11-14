/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-expressions */
import { computed, getCurrentInstance } from 'vue';

export const useVModel = (props: any, propName: any) => {
    const vm = getCurrentInstance()?.proxy;
    return computed({
        get() {
            return props[propName];
        },
        set(value: any) {
            vm?.$emit(`update:${propName}`, value);
        },
    });
};
