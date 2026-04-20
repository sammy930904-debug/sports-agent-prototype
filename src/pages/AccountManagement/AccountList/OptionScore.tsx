import {
    ModalForm,
    ProFormText,
    ProFormDigit,
} from '@ant-design/pro-components';
import { Button, Card, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    commission,
    memberDetail,
    getParents,
    addScore,
    lowerScore,
} from '@/api/home';
import { currencyList } from '@/common/system';
import { encrypt } from '@/utils/storage';
import { MemberAddParams } from '@/types/api/home';

interface Props {
    type: 'up' | 'down';
    tableRefresh: () => void;
    itemMemberCode?: string;
    propsSystemCode?: string;
}

const OptionScore = (props: Props) => {
    const { t } = useTranslation();

    const [form] = Form.useForm<MemberAddParams>();

    // select parent
    const [parentsList, setParentsList] = useState<
        { label: string; value: string }[]
    >([]);
    const [selectParent, setSelectParent] = useState('');
    const handleChange = (value: string) => {
        setSelectParent(value);
    };

    // 查询上级信息
    const [parentInfo, setParentInfo] = useState<any>({});
    // 下级信息
    const [subInfo, setSubInfo] = useState<any>({});

    // 查询交收方案
    const getDetailInfo = async (member_code: string) => {
        const res: any = await memberDetail({ member_code });

        if (res.code !== 10000) return null;

        const resCommission: any = await commission({ member_code });

        if (resCommission.code !== 10000) return null;

        const info = resCommission.data.find((item: any) => {
            return item.currency === res.data.commission_currency_id;
        });

        return info;
    };

    useEffect(() => {
        if (!selectParent) return;

        const fetch = async () => {
            const info = await getDetailInfo(selectParent);
            setParentInfo(info);
        };

        fetch();
    }, [selectParent]);

    console.log(props, 'subInfo');
    // console.log(parentInfo, 'parentInfo');

    return (
        <ModalForm<MemberAddParams>
            name="memberAdd"
            title={props.type === 'up' ? t('1488') : t('1489')}
            trigger={
                <Button
                    key="add"
                    type={'link'}
                    onClick={() => {
                        console.log('新增');
                    }}
                >
                    {props.type === 'up' ? t('1036') : t('1037')}
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
            onFinish={async (values: any) => {
                const request = props.type === 'up' ? addScore : lowerScore;
                const params: any = {
                    amount: values.amount,
                    currency_id: subInfo.currency,
                    member_code: selectParent,
                    pwd: encrypt(values.pwd),
                    to_member_code: props.itemMemberCode,
                };
                const res = await request(params);
                if (res.code === 10000) {
                    props.tableRefresh();
                    return true;
                }
            }}
            onVisibleChange={(open) => {
                if (open) {
                    getParents({
                        member_code: props.itemMemberCode || '',
                    }).then((res: any) => {
                        if (res.code === 10000) {
                            setParentsList(
                                res.data.map((item: any) => {
                                    return {
                                        label: `${item.member_code}(${item.system_code})`,
                                        value: item.member_code,
                                    };
                                }),
                            );
                            if (res.data.length > 0) {
                                setSelectParent(res.data[0].member_code);
                            }
                        }
                    });
                    // 获取下级信息
                    const fetch = async () => {
                        const info = await getDetailInfo(
                            props.itemMemberCode || '',
                        );
                        setSubInfo(info);
                    };

                    fetch();
                }
            }}
        >
            <div className="flex items-center mb-[12px]">
                <div className="mr-[12px]">{t('1038')}:</div>
                <Select
                    style={{ width: 240 }}
                    onChange={handleChange}
                    options={parentsList}
                    value={selectParent}
                />
            </div>

            <Card className="mb-[12px] smallCard">
                <span>{t('1052')}</span>
                <span className="ml-[12px]">
                    {t('1012')}:
                    {
                        currencyList.find(
                            (item) => item.id === parentInfo?.currency,
                        )?.currency_name
                    }
                </span>
                <span className="ml-[12px]">
                    {t('1013')}:{parentInfo?.commission_rate}%
                </span>
                <div>
                    {t('1492')}:{parentInfo?.balance}
                </div>
            </Card>
            <div className="flex items-center mb-[12px]">
                {t('1039')}:{props.itemMemberCode}({props.propsSystemCode})
            </div>
            <Card className="mb-[12px] smallCard">
                <span>{t('1052')}</span>
                <span className="ml-[12px]">
                    {t('1012')}:
                    {
                        currencyList.find(
                            (item) => item.id === subInfo?.currency,
                        )?.currency_name
                    }
                </span>
                <span className="ml-[12px]">
                    {t('1013')}:{subInfo?.commission_rate}%
                </span>

                <ProFormDigit
                    name="amount"
                    width={'md'}
                    label={props.type === 'up' ? t('1053') : t('1054')}
                    rules={[
                        {
                            required: true,
                            message:
                                props.type === 'up'
                                    ? (t('1490') as string)
                                    : (t('1491') as string),
                        },
                    ]}
                />
            </Card>
            <ProFormText.Password
                name="pwd"
                width={'md'}
                label={t('1049')}
                rules={[{ required: true, message: t('1059') as string }]}
            />
        </ModalForm>
    );
};

export default OptionScore;
