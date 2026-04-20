import React, { ComponentType, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { compose } from '@/utils/tools';
import {
    WithConfigProvider,
    WithOfflineMask,
    WithRecoilRoot,
    WithClientError,
    WithQueryClientProvider,
    WithServeError,
    WithCommonConfig,
} from '@/components/HOC';
import RenderRouter from './router';

function App() {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        document.title = t('1436');
    }, [t, i18n.language]);
    const RouteComponent = () => {
        return (
            <Router>
                <RenderRouter></RenderRouter>
            </Router>
        );
    };

    const renderer: (c: ComponentType) => ComponentType = compose(
        WithQueryClientProvider,
        WithRecoilRoot,
        WithConfigProvider,
        WithOfflineMask,
        WithClientError,
        WithServeError,
        WithCommonConfig,
    );

    const Main = renderer(RouteComponent);

    return <Main></Main>;
}

export default App;
