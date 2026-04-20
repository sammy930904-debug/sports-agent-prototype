import React from 'react';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '@/locales';

interface Props {
    header?: boolean;
}

const LanguageSwitcher = (props: Props) => {
    const { i18n } = useTranslation();
    const options = [
        { value: 'zh', label: '中文' },
        { value: 'en', label: 'English' },
        { value: 'ko', label: '한국인' },
    ];

    const menu = (
        <Menu
            onClick={({ key }) => {
                i18n.changeLanguage(key);
                localStorage.setItem('i18nextLng', key);
            }}
        >
            <Menu.Item key="zh">中文</Menu.Item>
            <Menu.Item key="en">English</Menu.Item>
            <Menu.Item key="ko">한국인</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <div className={props.header ? 'pointer' : 'lang-btn pointer'}>
                {options.find((item) => item.value === getLanguage())?.label}
                <DownOutlined />
            </div>
        </Dropdown>
    );
};

export default LanguageSwitcher;
