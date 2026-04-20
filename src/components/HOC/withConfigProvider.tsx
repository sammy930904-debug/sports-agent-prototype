import React, { useContext, useEffect } from 'react';
import { ConfigProvider, Empty } from 'antd';
import { ProProvider } from '@ant-design/pro-components';
import { ComponentType } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import ptBR from 'antd/es/locale/pt_BR';
import zhTW from 'antd/es/locale/zh_TW';
import koKR from 'antd/es/locale/ko_KR';
import thTH from 'antd/es/locale/th_TH';
import idID from 'antd/es/locale/id_ID';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import 'moment/locale/vi';
import 'moment/locale/pt-br';
import 'moment/locale/zh-tw';
import 'moment/locale/ko';
import 'moment/locale/th';
import 'moment/locale/id';
import { useTranslation } from 'react-i18next';
// moment.locale('zh-cn');

interface WithConfigProviderProps {}
const antdLocaleMap: Record<string, any> = {
    zh: zhCN,
    en: enUS,
    vi: viVN,
    'pt-BR': ptBR,
    tw: zhTW,
    ko: koKR,
    th: thTH,
    id: idID,
};

const momentLocaleMap: Record<string, string> = {
    zh: 'zh-cn',
    en: 'en-gb',
    vi: 'vi',
    'pt-BR': 'pt-br',
    tw: 'zh-tw',
    ko: 'ko',
    th: 'th',
    id: 'id',
};
export default function WithConfigProvider<
    Props extends WithConfigProviderProps,
>(WrappedComponent: ComponentType<Props>) {
    const Component: ComponentType<Props> = (props) => {
        // const values = useContext(ProProvider);
        const values = useContext(ProProvider);
        const { t, i18n } = useTranslation();
        const lang = i18n.language || 'en';
        const proLocale = lang === 'tw' ? 'zh-TW' : lang;

        // 让 moment 跟随当前语言
        useEffect(() => {
            moment.locale(momentLocaleMap[lang] ?? 'en-gb');
        }, [lang]);
        return (
            <ConfigProvider
                locale={antdLocaleMap[lang] ?? zhCN}
                renderEmpty={() => (
                    <Empty
                        description={t('1061', {
                            defaultValue: 'No data available',
                        })}
                    />
                )}
                autoInsertSpaceInButton
            >
                <ProProvider.Provider
                    value={{
                        ...values,
                        intl: {
                            // locale: lang,
                            locale: proLocale,
                            // getMessage: (id: string, defaultMessage: string) => {
                            //     console.log('[PRO_INTL]', id, defaultMessage);
                            //     t(id, { defaultValue: defaultMessage }),
                            // }
                            getMessage: (id, defaultMessage) => {
                                console.log('[PRO_INTL]', id, defaultMessage);
                                return t(id, { defaultValue: defaultMessage });
                            },
                        },
                        valueTypeMap: {
                            ...(values?.valueTypeMap || {}),
                            //自定义毫秒级时间戳-天
                            milliDate: {
                                render: (text: number) => (
                                    <span>
                                        {text
                                            ? moment
                                                  .unix(text)
                                                  .format('YYYY-MM-DD')
                                            : '-'}
                                    </span>
                                ),
                            },
                            //自定义毫秒级时间戳-小时
                            milliDateTime: {
                                render: (text: number) => (
                                    <span>
                                        {text
                                            ? moment
                                                  .unix(text)
                                                  .format('YYYY-MM-DD HH:mm:ss')
                                            : '-'}
                                    </span>
                                ),
                            },
                        },
                    }}
                >
                    <WrappedComponent {...props} />
                </ProProvider.Provider>
            </ConfigProvider>
        );
    };

    Component.displayName = `WithConfigProvider(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
