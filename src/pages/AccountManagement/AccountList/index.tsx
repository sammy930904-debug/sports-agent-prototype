import React, { useState } from 'react';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Card, Col, DatePicker, Radio, Row } from 'antd';
// import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import moment, { Moment } from 'moment';
import { nanoid } from 'nanoid';
import LangProTable from '@/components/LangProTable';
// import { gameList, updateAllGameRtp, updateGameRtp } from '@/api/gameInfo';
// import { getStorage } from '@/utils/storage';
// import LangProTable from '@/components/LangProTable';
import { statistics } from '@/api/home';
import { currencyList } from '@/common/system';
import AccountTable from './AccountTable';

type Preset = 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | '';
type Range = [Moment, Moment] | null;

interface AccountItem {}

const AccountList: React.FC = () => {
    const { t } = useTranslation();
    const actionRef = React.useRef<ActionType>();

    // 时间区间
    const getPresetRange = (type: Preset): [Moment, Moment] => {
        switch (type) {
            case 'thisWeek':
                return [moment().startOf('week'), moment().endOf('week')];

            case 'lastWeek':
                return [
                    moment().subtract(1, 'week').startOf('week'),
                    moment().subtract(1, 'week').endOf('week'),
                ];

            case 'thisMonth':
                return [moment().startOf('month'), moment().endOf('month')];

            case 'lastMonth':
                return [
                    moment().subtract(1, 'month').startOf('month'),
                    moment().subtract(1, 'month').endOf('month'),
                ];

            default:
                return [moment().startOf('week'), moment().endOf('week')];
        }
    };

    const isSameRange = (r1: Range, r2: Range) => {
        if (!r1 || !r2) return false;
        return r1[0].isSame(r2[0], 'day') && r1[1].isSame(r2[1], 'day');
    };

    const handleRangeChange = (values: any) => {
        const v = values as Range;
        setRange(v);

        if (!v) {
            setPreset('');
            return;
        }

        const thisWeekRange = getPresetRange('thisWeek');
        const lastWeekRange = getPresetRange('lastWeek');
        const thisMonthRange = getPresetRange('thisMonth');
        const lastMonthRange = getPresetRange('lastMonth');

        if (isSameRange(v, thisWeekRange)) {
            setPreset('thisWeek');
        } else if (isSameRange(v, lastWeekRange)) {
            setPreset('lastWeek');
        } else if (isSameRange(v, thisMonthRange)) {
            setPreset('thisMonth');
        } else if (isSameRange(v, lastMonthRange)) {
            setPreset('lastMonth');
        } else {
            setPreset('');
        }
        actionRef.current?.reload();
    };

    const [preset, setPreset] = useState<Preset>('thisWeek');
    const [range, setRange] = useState<Range>(getPresetRange('thisWeek'));

    const handleRadioChange = (e: any) => {
        const value: Preset = e.target.value;
        setPreset(value);
        const r = getPresetRange(value);
        setRange(r);
        actionRef.current?.reload();
    };

    // const [rangeArr, setRangeArr] = useState([
    //     getPresetRange(defaultRange)[0].format('YYYY-MM-DD'),
    //     getPresetRange(defaultRange)[1].format('YYYY-MM-DD'),
    // ]);

    const columns: ProColumns<any>[] = [
        {
            title: t('1012'),
            dataIndex: 'currency_id',
            hideInSearch: true,
            align: 'center',
            render: (_, record) => {
                return (
                    <span>
                        {
                            currencyList.find(
                                (item) => item.id === record.currency_id,
                            )?.currency_name
                        }
                    </span>
                );
            },
        },
        {
            title: t('1013'),
            dataIndex: 'commission_rate',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1014'),
            dataIndex: 'win_loss',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1015'),
            dataIndex: 'valid_bet',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1016'),
            dataIndex: 'balance',
            hideInSearch: true,
            align: 'center',
        },
        {
            title: t('1017'),
            dataIndex: 'total_balance',
            hideInSearch: true,
            align: 'center',
        },
    ];

    return (
        <>
            <Card>
                <Row wrap gutter={[16, 16]}>
                    <Col span={24}>
                        <Row
                            gutter={[16, 16]}
                            justify="start"
                            style={{ width: '100%' }}
                        >
                            <Col>
                                <Radio.Group
                                    defaultValue="a"
                                    buttonStyle="solid"
                                    size="large"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                    value={preset}
                                    onChange={handleRadioChange}
                                >
                                    <Radio.Button value="thisWeek">
                                        {t('1008')}
                                    </Radio.Button>
                                    <Radio.Button value="lastWeek">
                                        {t('1010')}
                                    </Radio.Button>
                                    <Radio.Button value="thisMonth">
                                        {t('1009')}
                                    </Radio.Button>
                                    <Radio.Button value="lastMonth">
                                        {t('1011')}
                                    </Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col>
                                <DatePicker.RangePicker
                                    size="large"
                                    value={range}
                                    onChange={handleRangeChange}
                                    disabledDate={(current) => {
                                        return (
                                            current &&
                                            current >= moment().startOf('day')
                                        );
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
            <LangProTable<any>
                actionRef={actionRef}
                columns={columns}
                toolBarRender={false}
                request={async (params) => {
                    if (!range)
                        return {
                            data: [],
                            success: true,
                            total: 0,
                        };
                    const [start, end] = range;
                    const res: any = await statistics({
                        start_time: start.startOf('day').valueOf(), //  当天00:00:00
                        end_time: end.endOf('day').valueOf(),
                    });

                    return {
                        data: res?.data || [],
                        success: true,
                        total: res?.data.length,
                    };
                }}
                pagination={false}
                rowKey={() => nanoid()}
                search={false}
                scroll={{ x: 'content-max' }}
            />
            <div className="w-full mt-[20px]">
                <AccountTable />
            </div>
        </>
    );
};

export default AccountList;
