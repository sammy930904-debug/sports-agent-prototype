import React, { FC } from 'react';
import { SpinProps, Spin } from 'antd';

type LoadingComponentProps = {};

const LoadingComponent: FC<LoadingComponentProps & SpinProps> = (props) => {
    return (
        <Spin
            {...props}
            className="w-full h-full flex justify-center items-center"
        ></Spin>
    );
};

export default LoadingComponent;
