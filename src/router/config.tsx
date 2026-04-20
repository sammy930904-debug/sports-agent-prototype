import React, { FC, Suspense } from 'react';
import { RouteProps } from 'react-router-dom';
import Loading from '@/components/Loading';
import PrivateRoute from './privateRoute';

export type WrapperRouteProps = RouteProps & {
    title?: string;
    auth?: boolean;
};

const PublicRoute = (props: any) => {
    return props.element;
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({
    title,
    auth,
    ...props
}) => {
    const WitchRoute = auth ? PrivateRoute : PublicRoute;

    if (title) {
        document.title = title;
    }
    return <WitchRoute {...props} />;
};

const WrapperRouteWithOutLayoutComponent: FC<WrapperRouteProps> = ({
    auth,
    ...props
}) => {
    return <Suspense fallback={<Loading />}>{props.element}</Suspense>;
};

export { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent };
