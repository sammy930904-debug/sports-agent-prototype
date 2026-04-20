import type { ProSettings } from '@ant-design/pro-components';
import { THEME_COLOR } from '@/common/constants';

const proSettings: ProSettings = {
    navTheme: 'dark',
    layout: 'side',
    contentWidth: 'Fluid',
    headerHeight: 48,
    primaryColor: THEME_COLOR,
    fixedHeader: true,
    fixSiderbar: true,
    splitMenus: false,
};

export default proSettings;
