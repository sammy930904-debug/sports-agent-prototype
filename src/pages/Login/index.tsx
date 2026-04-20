import React, { FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
    LoginFormPage,
    ProFormText,
    // ProFormSelect,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import UserToken from '@/common/token';
// import { ADMIN_NAME } from '@/common/constants';
import loginBg from '@/assets/images/login/login-bg.png';
import loginLogo from '@/assets/images/icon/react.svg';
import { useSetToken } from '@/store/user/hooks';
import { setStorage } from '@/utils/storage';
import { login, userInfo } from '@/api/home';
import { getLanguage, setLanguage } from '@/locales';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { decrypt, encrypt } from '@/utils/storage';
// import { cryptoDecrypt } from '@/utils/tools';

type LoginProps = {};

const Login: FC<LoginProps> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = UserToken.getToken();
    const setToken = useSetToken();
    const { mutateAsync: fetchLogin } = useMutation(login);

    const { t, i18n } = useTranslation();
    console.log(decrypt('opPBzcIo8hy0SV/0917XwA=='), '解密');

    const onFinish = async (values: any) => {
        const params = {
            identity: 'backend',
            member_code: values.member_code.toUpperCase(),
            password: encrypt(values.password),
        };
        const res: any = await fetchLogin(params);
        console.log(res, 'res');
        if (res.code === 10000) {
            setToken(res.data);
            userInfo().then((info) => {
                if (info.code === 10000) {
                    setStorage('userInfo', info.data);

                    // 登录成功，先清除URL中的sessionExpired参数
                    const url = new URL(window.location.href);
                    url.searchParams.delete('sessionExpired');
                    window.history.replaceState(null, '', url.href);
                    // message.success(t('1434'));
                    navigate('/accountManagement/accountList', {
                        replace: true,
                    });
                    // window.location.reload();
                }
            });
        } else {
            message.error(res.msg);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionExpired = query.get('sessionExpired');
        if (sessionExpired === 'true' && !token) {
            // 确保仅在没有token且sessionExpired=true时显示消息
            message.error(t('1435'));
        }
        if (location.pathname === '/user/login' && token) {
            navigate('/accountManagement/accountList', { replace: true });
        }
    }, [navigate, token]);

    useEffect(() => {
        const lang = getLanguage();
        if (i18n.language !== lang) {
            setLanguage(lang);
        }
    }, [i18n.language]);

    return (
        <div className="w-full h-full">
            <div className="lang-switcher">
                <LanguageSwitcher />
            </div>
            <LoginFormPage
                backgroundImageUrl={loginBg}
                logo={loginLogo}
                title={t('1436') as string}
                subTitle={'  '}
                onFinish={onFinish}
                onValuesChange={(values) => {
                    if (values.lang) {
                        setLanguage(values.lang);
                    }
                }}
                submitter={{
                    searchConfig: {
                        submitText: t('1004'),
                    },
                }}
            >
                <ProFormText
                    name="member_code"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={t('1001') as string}
                    rules={[
                        {
                            required: true,
                            message: t('1001') as string,
                        },
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder={t('1002') as string}
                    rules={[
                        {
                            required: true,
                            message: t('1002') as string,
                        },
                    ]}
                />
                {/* <ProFormSelect
                    name="lang"
                    label={t('1267')}
                    fieldProps={{
                        size: 'large',
                    }}
                    allowClear={false}
                    options={[
                        { value: 'zh', label: '中文' },
                        { value: 'en', label: 'English' },
                        // { value: 'vi', label: 'Tiếng Việt' },
                        // { value: 'pt-BR', label: 'Português' },
                        // { value: 'tw', label: '繁體中文' },
                        { value: 'ko', label: '한국인' },
                        // { value: 'th', label: 'แบบไทย' },
                        // { value: 'id', label: 'Indonesia' },
                    ]}
                    initialValue={getLanguage()}
                /> */}
            </LoginFormPage>
        </div>
    );
};

export default Login;
