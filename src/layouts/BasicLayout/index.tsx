import React, { FC, useState, Suspense, useMemo } from 'react';
import type { ProSettings } from '@ant-design/pro-components';
import {
    PageContainer,
    ProLayout,
    SettingDrawer,
} from '@ant-design/pro-components';
import { useRecoilValue } from 'recoil';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { delay } from 'lodash';
import { useTranslation } from 'react-i18next';
import { selectorDetailPageInfo } from '@/store/common/selectors';
import { THEME_COLOR } from '@/common/constants';
import { isDevMode } from '@/config/env';
import Loading from '@/components/Loading';
import logo from '@/assets/images/icon/react.svg';
import proSettings from '@/config/defaultSettings';
// import { useMenuRoutes } from '@/config/useMenuRoutes';
// import { menuRoute } from '@/config/route';
import menuRoute from '@/config/menuRoute';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import './layout.css';

type BasicLayoutProps = {};

const formatMenus = (
    menus: any[],
    t: (key: string) => string,
    parentKey = '',
): any[] => {
    return menus.map((item) => {
        const currentKey = parentKey ? `${parentKey}.${item.name}` : item.name;

        return {
            ...item,
            name: t(`menu.${currentKey}`),
            routes: item.routes
                ? formatMenus(item.routes, t, currentKey)
                : undefined,
        };
    });
};

const BasicLayout: FC<BasicLayoutProps> = (props) => {
    const detailPagInfo = useRecoilValue(selectorDetailPageInfo);
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        ...proSettings,
        navTheme: 'dark',
    });
    const navigate = useNavigate();
    const location = useLocation();
    // const menuRoutes = useMenuRoutes();
    const { t, i18n } = useTranslation();

    const menuData = useMemo(() => {
        return formatMenus(menuRoute.routes, t);
    }, [t, i18n.language]);

    return (
        <div id="m-pro-layout" className="h-screen">
            <ProLayout
                route={{ routes: menuData }}
                {...settings}
                navTheme="dark"
                location={{
                    pathname: location.pathname,
                }}
                fixSiderbar
                fixedHeader
                // title={ADMIN_NAME}
                title={t('1436') as string}
                logo={null}
                menuFooterRender={(props) => {
                    return (
                        <div className="w-full text-[#fff] text-[14px] p-[16px] flex justify-start items-center">
                            <img
                                alt="logo"
                                src={logo}
                                className="w-[32px] mr-[15px]"
                            />
                            <span style={{ fontSize: '12px' }}>
                                {!props?.collapsed && (t('1436') as string)}
                            </span>
                        </div>
                    );
                }}
                menuContentRender={(props, dom) => (
                    <div className="menu-content">
                        <span className="intro-step1">{dom}</span>
                    </div>
                )}
                onMenuHeaderClick={() => navigate('/')}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            navigate(item.path ?? '/404');
                        }}
                    >
                        {dom}
                    </div>
                )}
                rightContentRender={() => <Header></Header>}
                menuHeaderRender={(logo, title, props) => {
                    if (location.pathname !== detailPagInfo.path) {
                        return (
                            <div>
                                {logo}
                                {title}
                            </div>
                        );
                    }
                    if (props?.collapsed) {
                        return (
                            <Space>
                                <LeftOutlined
                                    style={{
                                        fontSize: 18,
                                        color: '#fff',
                                    }}
                                />
                            </Space>
                        );
                    }
                    return (
                        <Space direction="vertical">
                            <Button
                                icon={<LeftOutlined />}
                                onClick={() => {
                                    delay(() => {
                                        navigate(detailPagInfo.backPath ?? -1);
                                    }, 100);
                                }}
                            >
                                {detailPagInfo.title}
                            </Button>
                        </Space>
                    );
                }}
                footerRender={() => <Footer></Footer>}
            >
                <PageContainer
                    header={{
                        breadcrumbRender: (props: any) => {
                            return (
                                <div className="header-breadcrumb">
                                    {props?.currentMenu?.locale
                                        ?.split('.')
                                        ?.slice(1)
                                        ?.join('/')}
                                </div>
                            );
                        },
                    }}
                >
                    <Suspense fallback={<Loading />}>
                        <Outlet></Outlet>
                    </Suspense>
                </PageContainer>
            </ProLayout>
            {isDevMode() && (
                <SettingDrawer
                    pathname={location.pathname}
                    enableDarkTheme
                    getContainer={() => document.getElementById('m-pro-layout')}
                    settings={settings}
                    onSettingChange={(changeSetting) => {
                        setSetting(changeSetting);
                    }}
                    disableUrlParams={false}
                    colorList={[
                        {
                            key: 'daybreak',
                            color: THEME_COLOR as string,
                        },
                    ]}
                    hideHintAlert
                    hideCopyButton
                />
            )}
        </div>
    );
};

export default BasicLayout;
