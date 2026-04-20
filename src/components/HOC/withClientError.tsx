import React, { FC } from 'react';
import { ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface WithClientErrorProps {}

type ErrorProps = {
    message: string;
    handleError: () => void;
};

const Error: FC<ErrorProps> = ({ message, handleError }) => {
    return (
        <div className="w-full flex justify-center items-center">
            <Result
                status="error"
                title="应用发生错误"
                subTitle={message}
                extra={[
                    <Button
                        type="primary"
                        key="error"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            window.location.reload();
                            handleError();
                        }}
                    >
                        刷新页面
                    </Button>,
                ]}
            ></Result>
        </div>
    );
};

export default function WithClientError<Props extends WithClientErrorProps>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: ComponentType<Props> = (props) => {
        const Client = () => (
            <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <Error
                        message={error.message}
                        handleError={resetErrorBoundary}
                    ></Error>
                )}
            >
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );

        return <Client></Client>;
    };

    Component.displayName = `WithClientError(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
