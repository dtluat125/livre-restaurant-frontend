import { createI18n } from 'vue-i18n';
import { getLocaleFromModules } from './util';
import { appService } from '@/utils/app';
import { I18nConfig } from '@common/constants';
import commonEnApp from '@/common/locale/en/app.en';
import commonEnCommon from '@/common/locale/en/common.en';
import commonViApp from '@/common/locale/vi/app.vi';
import commonViCommon from '@/common/locale/vi/common.vi';

const localeModules = getLocaleFromModules();

const i18n = createI18n({
    locale: appService.currentAppLang, // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
        [I18nConfig.vi.code]: {
            ...localeModules.vi,
            common: {
                app: commonViApp,
                common: commonViCommon,
            },
        },
        [I18nConfig.en.code]: {
            ...localeModules.en,
            common: {
                app: commonEnApp,
                common: commonEnCommon,
            },
        },
    }, // set locale messages
    globalInjection: true,
});

export default i18n;
