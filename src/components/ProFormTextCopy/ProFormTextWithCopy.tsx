import React from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es';

interface ProFormTextWithCopyProps {
    name: string;
    label: string;
    rules?: any;
    placeholder?: string;
    disabled?: boolean;
    form: FormInstance;
}

const ProFormTextWithCopy: React.FC<ProFormTextWithCopyProps> = ({
    name,
    label,
    rules,
    placeholder,
    disabled,
    form,
}) => {
    const handleCopy = async () => {
        const valueToCopy = form.getFieldValue(name); // 直接从Form中获取当前字段的值
        if (valueToCopy) {
            try {
                await navigator.clipboard.writeText(valueToCopy);
                message.success('内容复制成功！');
            } catch (error) {
                message.error('复制失败，请重试！');
            }
        } else {
            message.warning('没有内容可复制！');
        }
    };

    return (
        <ProFormText
            label={label}
            name={name}
            rules={rules}
            placeholder={placeholder}
            disabled={disabled}
            fieldProps={{
                addonAfter: (
                    <div
                        onClick={handleCopy}
                        style={{
                            cursor: 'pointer',
                            color: disabled ? '#d9d9d9' : 'currentColor',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <CopyOutlined />
                    </div>
                ),
            }}
        />
    );
};

export default ProFormTextWithCopy;
