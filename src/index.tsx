import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@/locales'; //国际化
import './assets/css/base.css';
import './assets/scss/global.scss';
import './virtual:windi.css';
import './assets/scss/tailwind.scss';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(<App />);

reportWebVitals();
