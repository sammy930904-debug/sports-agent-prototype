import React, { useState } from 'react';
import {
    AreaChartOutlined,
    ToolOutlined,
    FormOutlined,
    MenuUnfoldOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
// import { getOwnerMenus } from '@/api/system';
import { useButtonPermissionList } from '@/store/user/hooks';
// import UserToken from '@/common/token';
interface RouteConfig {
    path: string;
    name: string;
    icon?: JSX.Element;
    routes?: RouteConfig[];
}
interface MenuItem {
    menu_id: number;
    menu_type: string;
    children?: MenuItem[];
}

const getIcon = (name: string): JSX.Element | null => {
    switch (name) {
        case '商户管理':
            return <AreaChartOutlined />;
        case '系统管理':
            return <ToolOutlined />;
        case '记录管理':
            return <FormOutlined />;
        case '报表管理':
            return <MenuUnfoldOutlined />;
        case '数据看板':
            return <BarChartOutlined />;
        default:
            return <ToolOutlined />;
    }
};
// 转换函数
const convertBackendDataToFrontendFormat = (data: {
    children?: MenuItem[];
}) => {
    const convertMenuItem = (menuItem: any): any | null => {
        if (menuItem.menu_type !== 'M') return null;

        const convertedItem: any = {
            path: menuItem.path,
            name: menuItem.menu_name,
            icon: getIcon(menuItem.menu_name),
        };

        if (menuItem.children && menuItem.children.length > 0) {
            const filteredChildren = menuItem.children.filter(
                (child: any) => child.menu_type === 'M',
            );
            convertedItem.routes = filteredChildren
                .map((child: any) => convertMenuItem(child))
                .filter((item: any) => item !== null) as any[];
        }

        return convertedItem;
    };

    const frontendData: any = {
        path: '/dashboard',
        routes: [],
    };

    if (data && data.children && data.children.length > 0) {
        const filteredChildren = data.children.filter(
            (child) => child.menu_type === 'M',
        );
        frontendData.routes = filteredChildren
            .map((child) => convertMenuItem(child))
            .filter((item) => item !== null) as any[];
    }

    return frontendData;
};

const extractMenuIds = (menus: MenuItem[]): number[] => {
    const ids: number[] = [];
    // 定义一个递归函数遍历所有菜单项及其子菜单
    const getIds = (menuItems: MenuItem[]) => {
        menuItems.forEach((item) => {
            if (item.menu_type === 'B') {
                ids.push(item.menu_id); // 当menu_type为"B"时，将当前菜单项的menu_id添加到数组中
            }
            if (item.children && item.children.length) {
                getIds(item.children); // 递归遍历子菜单
            }
        });
    };
    getIds(menus); // 从根菜单开始递归遍历
    return ids; // 返回所有符合条件的菜单项的menu_id组成的数组
};
export const useMenuRoutes = (): RouteConfig[] => {
    const [menuRoutes, setMenuRoutes] = useState<RouteConfig[]>([]);
    const { setButtonPermissionList } = useButtonPermissionList();
    // useEffect(() => {
    //     const fetchMenuData = async () => {
    //         try {
    //             const res: any = await getOwnerMenus({});
    //             if (res.state) {
    //                 setButtonPermissionList(extractMenuIds(res.data));
    //                 const convertedRoutes: any =
    //                     convertBackendDataToFrontendFormat(res.data[0]);
    //                 setMenuRoutes(convertedRoutes);
    //             } else {
    //                 console.error('菜单数据获取失败');
    //             }
    //         } catch (error) {
    //             console.error('获取菜单数据时发生错误:', error);
    //         }
    //     };

    //     if (UserToken.getToken()) {
    //         fetchMenuData();
    //     }
    // }, []);

    return menuRoutes;
};
