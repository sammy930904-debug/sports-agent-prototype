// import { useMutation } from '@tanstack/react-query';
import React, { ComponentType, FC, Fragment } from 'react';
// import { queryCurrencyList } from '@/api/system';
// import { setStorage } from '@/utils/storage';
import authToken from '@/common/token';

// 获取公共配置

interface WithCommonConfigProps {}
export default function WithCommonConfig<Props extends WithCommonConfigProps>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: FC<Props> = (props) => {
        const userToken = authToken.getToken() || '';
        // const { mutateAsync: fetchCurrencyList } =
        //     useMutation(queryCurrencyList);
        const formatCurrencyList = (currencyList: any) => {
            return currencyList.map((currency: any) => ({
                label: currency.currency_name,
                value: currency.id,
            }));
        };
        // const fetchData = async () => {
        //     const res: any = await fetchCurrencyList({});
        //     if (res.state) {
        //         setStorage('currencyList', formatCurrencyList(res?.data ?? []));
        //     }
        // };
        // useEffect(() => {
        //     if (userToken) {
        //         fetchData();
        //     }

        //     // eslint-disable-next-line react-hooks/exhaustive-deps
        // }, [window.location.pathname]);

        return (
            <Fragment>
                <WrappedComponent {...props} />
            </Fragment>
        );
    };

    Component.displayName = `WithCommonConfig(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
