import React, { FC, useState } from 'react';
import { Avatar, Dropdown, Menu, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDelToken } from '@/store/user/hooks';
import Polling from '@/utils/polling';
import { getStorage } from '@/utils/storage';
// import UserToken from '@/common/token';
import {
    // getUnreadMerchantNoticeCount,
    loginOut,
} from '@/api/home';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import UpdatePwdModal from './UpdatePwdModal';
import LangSelectModal from './LangSelectModal';
const polling = new Polling();
type HeaderProps = {};

const Header: FC<HeaderProps> = (props) => {
    const navigate = useNavigate();
    const delToken = useDelToken();
    const { t } = useTranslation();

    const userInfo: any = getStorage('userInfo');
    const [updatePwdVisible, setUpdatePwdVisible] = useState(false);
    const { mutateAsync: fetchLogout } = useMutation(loginOut);
    const [langSelectModalVisible, setLangSelectModalVisible] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const userLoginOut = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const res: any = await fetchLogout();
        if (res.code === 10000) {
            // message.success(t('1475'));
            delToken();
            navigate('/user/login');
        } else {
            // message.error(res.msg || t('1476'));
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // console.log(userInfo, 'userInfo');

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <span onClick={() => setUpdatePwdVisible(true)}>
                            {t('1006')}
                        </span>
                    ),
                    icon: <EditOutlined />,
                },
                {
                    key: '2',
                    label: <span onClick={userLoginOut}>{t('1007')}</span>,
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    );

    return (
        <div className="w-full flex justify-end items-center">
            <div className="mr-[20px]">
                <LanguageSwitcher header />
            </div>

            <Dropdown overlay={menu}>
                <div className="header-avatar flex items-center">
                    <Avatar size={32}>{userInfo?.member_code[0]}</Avatar>
                    <span className="tex-[14px] ml-[10px]">
                        {userInfo?.member_code || ''}
                    </span>
                </div>
            </Dropdown>
            <UpdatePwdModal
                visible={updatePwdVisible}
                onCancel={() => setUpdatePwdVisible(false)}
            />
            <LangSelectModal
                visible={langSelectModalVisible}
                onCancel={() => setLangSelectModalVisible(false)}
            />
            <Modal
                title={t('1007')}
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{t('1065')}</p>
            </Modal>
        </div>
    );
};

export default Header;
