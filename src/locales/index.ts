import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';
// import { getStorage } from '@/utils/storage';
import enUS from 'antd/lib/date-picker/locale/en_US';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import koKR from 'antd/lib/date-picker/locale/ko_KR';
//
import en from './en.json';
import zh from './zh.json';
import ko from './ko.json';

const dateLangMap = {
    en: enUS,
    zh: zhCN,
    ko: koKR,
};

const resources = {
    en: { translation: en },
    zh: { translation: zh },
    ko: { translation: ko },
};

const detectorOptions = {
    // order and from where user language should be detected
    order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
    ],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'sessionStorage'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
};

i18n.use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection: detectorOptions,
        resources,
        // lng: getStorage('i18nextLng') ?? 'zh',
        fallbackLng: 'en',
        keySeparator: false,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    } as any);

export default i18n;

export const setLanguage = (lang: keyof typeof resources) => {
    localStorage.setItem('i18nextLng', lang);
    sessionStorage.setItem('i18nextLng', lang);

    i18n.changeLanguage(lang);
};

export const getLanguage = (): keyof typeof resources => {
    const lang = (localStorage.getItem('i18nextLng') ||
        sessionStorage.getItem('i18nextLng') ||
        'en') as keyof typeof resources;

    return lang in resources ? lang : 'en';
};

export const getDateLocale = () => {
    const lang = getLanguage();
    return dateLangMap[lang];
};
