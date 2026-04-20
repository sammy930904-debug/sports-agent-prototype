import React, { FC } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { ADMIN_NAME } from '@/common/constants';
import logo from '@/assets/images/icon/react.svg';

type WelcomeProps = {};

const Welcome: FC<WelcomeProps> = (props) => {
    return (
        <ProCard className="w-full h-[calc(100vh-140px)] flex justify-center items-center">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <img src={logo} alt="" className="w-[100px]" />
                <h1 className="text-[26px] font-bold mt-[40px]">
                    欢迎使用{ADMIN_NAME}综合管理系统
                </h1>
            </div>
        </ProCard>
    );
};

export default Welcome;
