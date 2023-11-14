import camelCase from 'lodash/camelCase';
import { LocaleMessages, VueMessageType } from 'vue-i18n';
import langVi from 'element-plus/lib/locale/lang/vi';
import langEn from 'element-plus/lib/locale/lang/en';
import yupEn from '../yup/locale/en';
import yupVi from '../yup/locale/vi';
import { REGEX, I18nConfig } from '@/common/constants';

const parseLocale = (
    file: string,
    type = I18nConfig.vi.extension,
    obj: Record<string, Record<string, unknown>>,
) => {
    let filename = `${file}`.replace(REGEX.FOLDER_PATH, '');
    const arr = file.split('/');
    const tmp: Record<string, unknown> = {};
    if (arr.length > 1) {
        let moduleName = file.split('/')[1];
        filename = filename.replace(type, '');
        filename = camelCase(filename);
        moduleName = camelCase(moduleName);
        file = file.replace('./', '/');
        tmp[filename] = require('@/modules' + file);
        if (!obj[moduleName]) {
            obj[moduleName] = {};
        }
        obj[moduleName][filename] = (
            tmp[filename] as { default: Record<string, unknown> }
        ).default;
    }
};

const getViModuleFromCode = () => {
    const locale: LocaleMessages<VueMessageType> = {};
    const files = require.context('@/modules', true, /vi\.ts$/);
    if (files) {
        files.keys().forEach((file) => {
            parseLocale(file, I18nConfig.vi.extension, locale);
        });
    }
    locale.el = { ...langVi.el };
    locale.yup = yupVi;
    return locale;
};

const getEnModuleFromCode = () => {
    const locale: LocaleMessages<VueMessageType> = {};
    const files = require.context('@/modules', true, /en\.ts$/);
    if (files) {
        files.keys().forEach((file) => {
            parseLocale(file, I18nConfig.en.extension, locale);
        });
    }
    locale.el = { ...langEn.el };
    locale.yup = yupEn;
    return locale;
};

export const getLocaleFromModules = (): LocaleMessages<VueMessageType> => {
    const localeVi = getViModuleFromCode();
    const localeEn = getEnModuleFromCode();
    return {
        [I18nConfig.en.code]: localeEn,
        [I18nConfig.vi.code]: localeVi,
    };
};
