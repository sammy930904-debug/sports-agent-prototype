import React from 'react';
import { RouteObject } from 'react-router-dom';
import AccountManagement from '@/pages/AccountManagement/AccountList';
import Redirect from '@/router/Redirect';
import { WrapperRouteComponent } from '../config';

const MemberManagementRoute = () => {
    const routeList: RouteObject[] = [
        {
            path: '/accountManagement',
            element: <Redirect to="/accountManagement/accountList" />,
        },
        {
            path: '/accountManagement/accountList',
            element: (
                <WrapperRouteComponent
                    element={<AccountManagement />}
                    title="账号管理"
                    auth
                />
            ),
        },
    ];
    return routeList;
};

export default MemberManagementRoute;
