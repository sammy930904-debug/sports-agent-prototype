import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormRadio,
    ProFormItem,
    ProColumns,
    ProFormDigit,
} from '@ant-design/pro-components';
import { Button, Card, Col, Form, Row } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangProTable from '@/components/LangProTable';
import {
    commission,
    nextCode,
    memberAdd,
    memberDetail,
    memberEdit,
    subAdd,
} from '@/api/home';
import { currencyList } from '@/common/system';
import { getStorage } from '@/utils/storage';
import { MemberAddParams } from '@/types/api/home';
import { encrypt } from '@/utils/storage';

interface Props {
    type: 'add' | 'edit' | 'sub_add';
    tableRefresh: () => void;
    itemMemberCode?: string;
    propsSystemCode?: string;
}

const MemberAddModal = (props: Props) => {
    const userInfo: any = getStorage('userInfo');
    const { t } = useTranslation();
    const [systemCode, setSystemCode] = useState('');
    const [form] = Form.useForm<MemberAddParams>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([1]);
    const [data, setData] = useState<any[]>([]);

    const columns: ProColumns<any>[] = [
        {
            title: t('1012'),
            dataIndex: 'currency',
            align: 'center',
            render: (_, record) => {
                return currencyList.find((item) => item.id === record.currency)
                    ?.currency_name;
            },
        },
        {
            title: t('1013'),
            dataIndex: 'commission_rate',
            align: 'center',
        },
        {
            title: t('1023'),
            dataIndex: 'balance',
            align: 'center',
        },
    ];

    return (
        <ModalForm<MemberAddParams>
            name="memberAdd"
            title={props.type === 'add' ? t('1025') : t('1035')}
            trigger={
                <Button
                    key="add"
                    type={props.type === 'add' ? 'primary' : 'link'}
                    onClick={() => {
                        console.log('新增');
                    }}
                >
                    {props.type === 'add' ? <PlusOutlined /> : null}
                    {props.type === 'add' || props.type === 'sub_add'
                        ? t('1025')
                        : t('1035')}
                </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    // message.info('已关闭');
                },
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                const params: any = {
                    ...values,
                    system_code: systemCode,
                    member_code: values.member_code.toUpperCase(),
                    password: encrypt(values.password),
                    pwd: encrypt(values.pwd),
                };
                delete params.confirmPassword;
                if (props.type === 'edit') {
                    delete params.system_code;
                }
                const request =
                    props.type === 'add'
                        ? memberAdd
                        : props.type === 'edit'
                        ? memberEdit
                        : subAdd;
                // 给下级新增
                if (props.type === 'sub_add') {
                    params.target_agent_code = props.itemMemberCode;
                }

                const res = await request(params);
                if (res.code === 10000) {
                    // message.success(t('1026'));
                    props.tableRefresh();
                    setSystemCode('');
                    return true;
                }
                // return true;
            }}
            onVisibleChange={(open) => {
                if (open) {
                    let memberCodeParam = userInfo?.member_code;
                    if (props.type === 'edit' || props.type === 'sub_add') {
                        memberCodeParam = props.itemMemberCode;
                    }
                    commission({ member_code: memberCodeParam }).then(
                        (res: any) => {
                            if (res.code === 10000) {
                                setData(res.data);
                            }
                        },
                    );
                    if (props.type === 'add' || props.type === 'sub_add') {
                        nextCode({ member_code: memberCodeParam }).then(
                            (res: any) => {
                                if (res.code === 10000) {
                                    setSystemCode(res.data);
                                }
                            },
                        );
                    }

                    if (props.type === 'edit') {
                        memberDetail({
                            member_code: props.itemMemberCode || '',
                        }).then((res: any) => {
                            if (res.code === 10000) {
                                form.setFieldsValue(res.data);
                                // form.setFieldsValue({
                                //     confirmPassword: res.data.password,
                                // });
                                setSelectedRowKeys([
                                    res.data.commission_currency_id,
                                ]);
                            }
                        });
                    }
                }
            }}
        >
            <Card className="mb-[12px] smallCard" hoverable>
                {t('1038')}:{userInfo?.member_name}({userInfo?.system_code})
            </Card>
            <Card className="mb-[12px] smallCard" hoverable>
                {t('1021')}:
                {props.type === 'add' || props.type === 'sub_add'
                    ? systemCode
                    : props.propsSystemCode}
            </Card>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="member_code"
                    label={t('1022')}
                    rules={[
                        { required: true, message: t('1482') as string },
                        {
                            min: 6,
                            max: 15,
                            message: t('1487') as string,
                        },
                    ]}
                    disabled={props.type === 'edit'}
                />

                <ProFormText
                    width="md"
                    name="member_name"
                    label={t('1040')}
                    rules={[
                        {
                            min: 6,
                            max: 20,
                            message: t('1486') as string,
                        },
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText.Password
                    width="md"
                    name="password"
                    label={t('1042')}
                    rules={[
                        { required: true, message: t('1003') as string },
                        {
                            min: 6,
                            max: 20,
                            message: t('1486') as string,
                        },
                    ]}
                />
                <ProFormText.Password
                    width="md"
                    name="confirmPassword"
                    label={t('1043')}
                    rules={[
                        { required: true, message: t('1484') as string },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('password') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(t('1058') as string),
                                );
                            },
                        }),
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText width="md" name="phone_number" label={t('1476')} />
                <ProFormText
                    width="md"
                    name="back_up_phone_number"
                    label={t('1477')}
                />
            </ProForm.Group>
            <Row>
                <Col span={12}>
                    <ProFormRadio.Group
                        name="identity"
                        label={t('1031')}
                        options={[
                            { label: t('1032'), value: 1 },
                            { label: t('1475'), value: 2 },
                        ]}
                        initialValue={1}
                        rules={[{ required: true }]}
                        fieldProps={{
                            disabled:
                                props.type === 'edit' &&
                                form.getFieldValue('identity') === 1,
                        }}
                    />
                </Col>
                <Col span={12}>
                    <ProFormRadio.Group
                        name="status"
                        label={t('1027')}
                        options={[
                            { label: t('1478'), value: true },
                            { label: t('1479'), value: false },
                        ]}
                        initialValue={true}
                        rules={[{ required: true }]}
                    />
                </Col>
            </Row>
            <ProFormItem
                name="commission_currency_id"
                label={t('1046')}
                rules={[{ required: true }]}
                initialValue={
                    props.type === 'add'
                        ? data[0]?.currency
                        : form.getFieldValue('commission_currency_id')
                }
            >
                <LangProTable
                    rowKey={'currency'}
                    columns={columns}
                    dataSource={data}
                    search={false}
                    options={false}
                    pagination={false}
                    toolBarRender={false}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys,
                        onChange: (keys) => {
                            if (props.type === 'edit') return;
                            setSelectedRowKeys(keys);
                            form.setFieldsValue({
                                commission_currency_id: keys[0] as number,
                            });
                        },
                    }}
                />
            </ProFormItem>
            <div style={{ marginBottom: 12 }}>{t('1480')}</div>
            <ProFormDigit
                name="commission_rate"
                width={'md'}
                label={t('1048')}
                rules={[{ required: true, message: t('1483') as string }]}
                extra={<div style={{ marginTop: 6 }}>{t('1481')}</div>}
            />

            <ProFormText.Password
                name="pwd"
                width={'md'}
                label={t('1049')}
                rules={[{ required: true, message: t('1059') as string }]}
            />
        </ModalForm>
    );
};

export default MemberAddModal;
