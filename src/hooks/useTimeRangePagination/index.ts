import React, { useRef, useState } from 'react';
import moment from 'moment';
import { ProFormInstance } from '@ant-design/pro-components';

interface TimeRangePaginationOptions {
    fetchData: (params: any) => Promise<any>;
    formRef: React.MutableRefObject<ProFormInstance | undefined>;
    extraParams?: Record<string, any>;
}

const useTimeRangePagination = ({
    fetchData,
    formRef,
    extraParams = {},
}: TimeRangePaginationOptions) => {
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<any>();
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    const recordTime = useRef({
        start_time: moment().startOf('day').unix() * 1000,
        end_time: moment().endOf('day').unix() * 1000,
    });

    const handleSelectTime = (time: any) => {
        recordTime.current = {
            start_time: moment(time[0]).unix() * 1000,
            end_time: moment(time[1]).unix() * 1000,
        };
    };

    const handleFetchData = async (
        newParams: any = {},
        isNextPage = false,
        isPrevPage = false,
        flag?: number,
    ) => {
        setLoading(true);

        // 处理 reset 参数
        if (newParams.reset) {
            recordTime.current = {
                start_time: moment().startOf('day').valueOf(),
                end_time: moment().endOf('day').valueOf(),
            };
            // 移除 reset 参数，避免传递给后端 API
            delete newParams.reset;
        }

        const res = await fetchData({
            current: 1,
            start_time: recordTime.current.start_time,
            end_time: recordTime.current.end_time,
            pageSize: 20,
            ...extraParams,
            ...newParams,
            flag,
        });

        const data = res?.data?.d || [];
        console.log(data, 'data');
        setTableData(data);

        setIsPrevDisabled(isPrevPage && data.length < 20);
        setIsNextDisabled(isNextPage && data.length < 20);

        setLoading(false);
        return data;
    };

    const handlePrevPage = () => {
        if (isPrevDisabled) return;

        const currentValues = formRef.current?.getFieldsValue() ?? {};
        const timeRange = currentValues.timeRange;

        const startTime = tableData[0]?.create_at ?? timeRange[0];
        console.log(startTime, 'startTime');
        const endTime =
            timeRange && timeRange[1]
                ? moment(timeRange[1]).valueOf()
                : moment(startTime).add(7, 'days').valueOf();

        recordTime.current = {
            start_time: startTime + 1,
            end_time: endTime,
        };

        const { timeRange: _, ...rest } = currentValues;
        handleFetchData(rest, false, true, 1); // Added flag: 1
        setIsNextDisabled(false);
    };

    const handleNextPage = () => {
        if (isNextDisabled) return;

        const currentValues = formRef.current?.getFieldsValue() ?? {};
        const timeRange = currentValues.timeRange;

        const endTime =
            tableData[tableData.length - 1]?.create_at ??
            (timeRange && timeRange[1]
                ? moment(timeRange[1]).valueOf()
                : moment().valueOf());

        const startTime =
            timeRange && timeRange[0]
                ? moment(timeRange[0]).valueOf()
                : moment(endTime).subtract(7, 'days').valueOf();

        recordTime.current = {
            start_time: startTime,
            end_time: endTime - 1,
        };

        const { timeRange: _, ...rest } = currentValues;
        handleFetchData(rest, true, false, 2); // Added flag: 2
        setIsPrevDisabled(false);
    };

    return {
        loading,
        tableData,
        isPrevDisabled,
        isNextDisabled,
        recordTime,
        handleSelectTime,
        handleFetchData,
        handlePrevPage,
        handleNextPage,
    };
};

export default useTimeRangePagination;
