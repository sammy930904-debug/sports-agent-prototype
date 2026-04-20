import React, { memo } from 'react';
import { message } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { changePassword } from '@/api/home';
import { getStorage } from '@/utils/storage';
import { encrypt } from '@/utils/storage';
interface UpdatePwdModalProps {
    visible: boolean;
    onCancel: () => void;
}

const UpdatePwdModal: React.FC<UpdatePwdModalProps> = ({
    visible,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [form] = ProForm.useForm();
    const userInfo: any = getStorage('userInfo');

    const handleSubmit = async (values: any) => {
        const res = await changePassword({
            member_name: userInfo.member_name,
            old_pwd: encrypt(values.old_pwd),
            new_pwd: encrypt(values.new_pwd),
        });
        if (res.code === 10000) {
            message.success(t('1062'));
            onCancel();
            form.resetFields();
        } else {
            message.error(t('1063'));
        }
    };

    return (
        <>
            <ModalForm
                title={t('1006')}
                visible={visible}
                onVisibleChange={(open) => {
                    if (!open) {
                        onCancel();
                    }
                }}
                form={form}
                onFinish={handleSubmit}
                modalProps={{
                    onCancel: () => {
                        form.resetFields();
                        onCancel();
                    },
                    okText: t('1051'),
                    cancelText: t('1050'),
                }}
            >
                <ProFormText.Password
                    name="old_pwd"
                    // label={t('1007')}
                    placeholder={t('1060') as string}
                    rules={[{ required: true, message: t('1060') as string }]}
                />
                <ProFormText.Password
                    name="new_pwd"
                    // label={t('1008')}
                    placeholder={t('1061') as string}
                    rules={[{ required: true, message: t('1061') as string }]}
                />
                <ProFormText.Password
                    name="confirmPassword"
                    // label={t('1009')}
                    placeholder={t('1474') as string}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: t('1474') as string },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('new_pwd') === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(t('1058') as string),
                                );
                            },
                        }),
                    ]}
                />
            </ModalForm>
        </>
    );
};

export default memo(UpdatePwdModal);
