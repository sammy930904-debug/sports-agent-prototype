import React from 'react';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space, Switch } from 'antd';
import LangProTable from '@/components/LangProTable';
import { memberList } from '@/api/home';
import { currencyList } from '@/common/system';
import MemberAddModal from './MemberAddModal';
import OptionScore from './OptionScore';

const formatTreeData = (list: any[]): any[] => {
    return list.map((item) => {
        const newItem: any = { ...item };

        if (newItem.children && newItem.children.length > 0) {
            newItem.children = formatTreeData(newItem.children);
        } else {
            delete newItem.children;
        }

        return newItem;
    });
};

const AccountTable: React.FC = () => {
    const { t } = useTranslation();
    const actionRef = React.useRef<ActionType>();

    const columns: ProColumns<any>[] = [
        {
            title: '',
            dataIndex: 'member_code',
            hideInTable: true,
            renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
                return (
                    <Input
                        placeholder={t('1018') as string}
                        prefix={<SearchOutlined />}
                        allowClear
                        onPressEnter={() => form?.submit()}
                    />
                );
            },
        },
        {
            title: t('1021'),
            dataIndex: 'system_code',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1022'),
            dataIndex: 'member_code',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1012'),
            dataIndex: 'commission_currency_id',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return currencyList.find(
                    (item) => item.id === record.commission_currency_id,
                )?.currency_name;
            },
        },
        {
            title: t('1023'),
            dataIndex: 'balance',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1026'),
            dataIndex: 'total_balance',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1024'),
            dataIndex: 'sub_total',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1027'),
            dataIndex: 'status',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return (
                    <Switch
                        checkedChildren={t('1028')}
                        unCheckedChildren={t('1029')}
                        checked={record.status}
                    />
                );
            },
        },
        {
            title: t('1031'),
            dataIndex: 'identity',
            hideInSearch: true,
            align: 'center',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        label: t('1032'),
                        value: 1,
                    },
                    {
                        label: t('1475'),
                        value: 2,
                    },
                ],
            },
        },
        {
            title: t('1034'),
            dataIndex: 'option',
            hideInSearch: true,
            align: 'center',
            fixed: 'right',
            width: 400,
            render: (_, record) => {
                return (
                    <Space>
                        <MemberAddModal
                            key="edit"
                            type="edit"
                            tableRefresh={tableRefresh}
                            itemMemberCode={record.member_code}
                            propsSystemCode={record.system_code}
                        />
                        <MemberAddModal
                            key="sub_add"
                            type="sub_add"
                            tableRefresh={tableRefresh}
                            itemMemberCode={record.member_code}
                            propsSystemCode={record.system_code}
                        />
                        <OptionScore
                            key="up"
                            type="up"
                            tableRefresh={tableRefresh}
                            itemMemberCode={record.member_code}
                            propsSystemCode={record.system_code}
                        />
                        <OptionScore
                            key="down"
                            type="down"
                            tableRefresh={tableRefresh}
                            itemMemberCode={record.member_code}
                            propsSystemCode={record.system_code}
                        />
                    </Space>
                );
            },
        },
    ];
    const tableRefresh = () => {
        actionRef.current?.reload();
    };

    return (
        <LangProTable<any>
            actionRef={actionRef}
            columns={columns}
            search={{
                optionRender: (searchConfig, formProps, dom) => [
                    <MemberAddModal
                        key={'add'}
                        type="add"
                        tableRefresh={tableRefresh}
                    />,
                    ...dom,
                ],
            }}
            request={async (params) => {
                const res: any = await memberList({
                    member_code: params.member_code,
                });
                if (res.code === 10000) {
                    if (res.data && res.data.length > 0) {
                        return {
                            data: formatTreeData(res?.data),
                            success: true,
                            total: res?.data.length,
                        };
                    } else {
                        return {
                            data: [],
                            success: true,
                            total: 0,
                        };
                    }
                } else {
                    return {
                        data: [],
                        success: true,
                        total: 0,
                    };
                }
            }}
            pagination={false}
            rowKey={(record) => `${record.memberCode}-${record.member_name}`}
            scroll={{ x: 'content-max' }}
        />
    );
};

export default AccountTable;
