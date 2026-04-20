import React from 'react';
import { Button, Switch } from 'antd';
import { useButtonPermissionList } from '@/store/user/hooks';

const PermissionButton = ({
    permissionId = 123,
    children,
    disabled,
    onClick,
    useType = 'button',
    record,
    handleSwitchGoogleCode,
    ...restProps
}: {
    permissionId?: number;
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: any) => void;
    useType?: 'button' | 'switch';
    record?: any; // 记录用于Switch类型按钮的数据
    handleSwitchGoogleCode?: (record: any, checked: boolean) => void;
    [key: string]: any;
}) => {
    const { buttonPermissionList } = useButtonPermissionList();

    const isPermitted = buttonPermissionList.includes(permissionId);
    const finalDisabled = disabled || !isPermitted;

    const handleClick = (e: any) => {
        if (!isPermitted) {
            e.preventDefault();
            e.stopPropagation();
            console.log('没有权限点击此按钮');
            return;
        }
        if (onClick) {
            onClick(e);
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        if (!isPermitted) {
            console.log('没有权限切换此开关');
            return; // 可以添加逻辑阻止状态改变
        }
        if (handleSwitchGoogleCode) {
            handleSwitchGoogleCode(record, checked);
        }
    };

    if (useType === 'switch') {
        return (
            <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                checked={record?.is_open_opt === 1}
                onChange={handleSwitchChange}
                disabled={finalDisabled}
                {...restProps}
            />
        );
    }

    return (
        <Button {...restProps} onClick={handleClick} disabled={finalDisabled}>
            {children}
        </Button>
    );
};

export default PermissionButton;
