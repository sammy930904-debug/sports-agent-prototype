import React, { lazy, FC, useEffect } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import NotFound from '@/pages/ResultPage/NotFound';
import {
    WrapperRouteComponent,
    WrapperRouteWithOutLayoutComponent,
} from './config';
import Redirect from './Redirect';
import BasicLayout from '../layouts/BasicLayout';
import UserLayout from '../layouts/UserLayout';
import AccountManagement from './AccountManagement';

NProgress.configure({ showSpinner: false });
const Login = lazy(() => import('@/pages/Login'));
const AccountList = lazy(() => import('@/pages/AccountManagement/AccountList'));
const NotAuthority = lazy(() => import('../pages/ResultPage/NotAuthority'));

const routeList: RouteObject[] = [
    {
        path: '/',
        element: (
            <WrapperRouteComponent
                element={<BasicLayout />}
                title="账号管理"
                auth
            />
        ),
        children: [
            {
                path: '/',
                element: <Redirect to="/accountManagement/accountList" />,
            },
            {
                path: '/accountManagement/accountList',
                element: (
                    <WrapperRouteComponent
                        element={<AccountList />}
                        title="账号管理"
                        auth
                    />
                ),
            },
        ],
    },
    {
        path: '/accountManagement',
        element: (
            <WrapperRouteComponent
                element={<BasicLayout />}
                title="账号管理"
                auth
            />
        ),
        children: [...AccountManagement()],
    },
    {
        path: '/user',
        element: (
            <WrapperRouteWithOutLayoutComponent element={<UserLayout />} />
        ),
        children: [
            {
                path: '/user/login',
                element: (
                    <WrapperRouteWithOutLayoutComponent
                        element={<Login />}
                        title="登录"
                    />
                ),
            },
        ],
    },
    {
        path: '*',
        element: (
            <WrapperRouteWithOutLayoutComponent
                element={<NotFound />}
                title="404"
            />
        ),
    },
    {
        path: '/403',
        element: (
            <WrapperRouteWithOutLayoutComponent
                element={<NotAuthority />}
                title="403"
            />
        ),
    },
];

const RenderRouter: FC = () => {
    useEffect(() => {
        NProgress.done();
        return () => {
            NProgress.start();
        };
    });
    const element = useRoutes(routeList);
    return element;
};

export default RenderRouter;
