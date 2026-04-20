import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { ComponentType } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { deffHttp } from '@/utils/axios';

type WithServeErrorProps = {};

export default function WithServeError<Props extends WithServeErrorProps>(
    WrappedComponent: ComponentType<Props>,
) {
    const [status, setStatus] = useState<number>(0);

    deffHttp.getResponseResult((response) => {
        if (response.status >= 500) {
            setStatus(response.status);
        }
        return response;
    });

    const Component: ComponentType<Props> = (props) => (
        <WrappedComponent {...props} />
    );

    Component.displayName = `WithServeError(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    const { t } = useTranslation();

    const Server = () => (
        <Result
            status="500"
            title={t('1407')}
            subTitle={t('1408')}
            extra={
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    {t('1409')}
                </Button>
            }
        />
    );

    return status >= 500 ? Server : Component;
}
