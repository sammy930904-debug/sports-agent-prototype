import { Button, Result } from 'antd';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface Props {}

const NotFound: FC<Props> = () => {
    const { t } = useTranslation();
    return (
        <Result
            status="404"
            title="404"
            subTitle={t('1477')}
            extra={
                <NavLink to="/">
                    <Button type="primary" icon={<LeftOutlined />}>
                        {t('1478')}
                    </Button>
                </NavLink>
            }
        />
    );
};
export default NotFound;
