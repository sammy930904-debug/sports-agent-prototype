import React from 'react';
import { Result } from 'antd';
import { DisconnectOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { ComponentType, FC, useEffect, useState } from 'react';

interface WithOfflineMaskProps {}
export default function WithOfflineMask<Props extends WithOfflineMaskProps>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: FC<Props> = (props) => {
        const [onLine, setOnLineStatus] = useState(window.navigator.onLine);
        useEffect(() => {
            const wait = 1000;
            const setOnLine = debounce(
                () => setOnLineStatus(window.navigator.onLine),
                wait,
            );

            window.addEventListener('online', setOnLine);
            window.addEventListener('offline', setOnLine);
            return () => {
                window.removeEventListener('online', setOnLine);
                window.removeEventListener('offline', setOnLine);
            };
        }, [onLine]);

        if (onLine) {
            return <WrappedComponent {...props} />;
        }

        return (
            <>
                <Result
                    className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-[#fff]"
                    status="error"
                    icon={<DisconnectOutlined />}
                    title="与服务器的连接丢失"
                    subTitle="请检查您的互联网连接，然后重试"
                />
            </>
        );
    };

    Component.displayName = `WithOfflineMask(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
