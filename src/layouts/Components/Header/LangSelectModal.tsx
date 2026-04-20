import React, { memo } from 'react';
import { ModalForm, ProForm, ProFormSelect } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { getLanguage, setLanguage } from '@/locales';
interface LangSelectModalProps {
    visible: boolean;
    onCancel: () => void;
}

const LangSelectModal: React.FC<LangSelectModalProps> = ({
    visible,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [form] = ProForm.useForm();

    const handleSubmit = async (values: { lang: string }) => {
        console.log(values, 'values');
        setLanguage(values.lang as any);
        onCancel();
    };

    return (
        <>
            <ModalForm
                title={t('1266')}
                visible={visible}
                onVisibleChange={(open) => {
                    if (!open) {
                        onCancel();
                    }
                    if (open) {
                        console.log(getLanguage(), 'getLanguage()');
                        form.setFieldsValue({
                            lang: getLanguage(),
                        });
                    } else {
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
                    okText: t('1109'),
                    cancelText: t('1015'),
                }}
            >
                <ProFormSelect
                    name="lang"
                    label={t('1267')}
                    options={[
                        { value: 'zh', label: '简体中文' },
                        { value: 'en', label: 'English' },
                        // { value: 'vi', label: 'Tiếng Việt' },
                        // { value: 'pt-BR', label: 'Português' },
                        // { value: 'tw', label: '繁體中文' },
                        // { value: 'ko', label: '한국인' },
                        // { value: 'th', label: 'แบบไทย' },
                        // { value: 'id', label: 'Indonesia' },
                    ]}
                />
            </ModalForm>
        </>
    );
};

export default memo(LangSelectModal);
