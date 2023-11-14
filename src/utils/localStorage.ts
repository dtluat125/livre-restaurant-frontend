import { SupportLanguage } from '@/common/constants';
import { AppEnum } from './app';

const LocalStorage = {
    setLang(lang: string): void {
        localStorage.setItem(AppEnum.LANG, lang);
    },

    getLang(): string {
        return localStorage.getItem(AppEnum.LANG) || SupportLanguage.EN;
    },
};

export default LocalStorage;
