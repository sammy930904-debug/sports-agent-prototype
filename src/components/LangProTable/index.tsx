import React from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProTableProps } from '@ant-design/pro-components';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

type AnyObj = Record<string, any>;

export default function LangProTable<
    T extends AnyObj,
    U extends AnyObj = AnyObj,
>(props: ProTableProps<T, U>) {
    const { t } = useTranslation();

    return (
        <ProTable<T, U>
            locale={{
                emptyText: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('1485', {
                            defaultValue: 'No data available',
                        })}
                    />
                ),
                ...(props.locale || {}),
            }}
            pagination={{
                showQuickJumper: false,
                showSizeChanger: false,
            }}
            {...props}
        />
    );
}
