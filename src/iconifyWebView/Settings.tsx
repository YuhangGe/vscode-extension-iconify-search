import { Button, Form, Modal, Select } from 'antd';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { SettingsData } from '../common';
import { globalStore } from './store';
import { vscode } from './vscode';

const CodeTypeOptions = [
  {
    label: 'SVG',
    value: 'svg',
  },
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Vue',
    value: 'vue',
  },
  {
    label: 'Tailwind CSS',
    value: 'tailwindcss',
  },
  {
    label: 'Tailwind CSS React',
    value: 'tailwindcss-react',
  },
  {
    label: 'Iconify Icon',
    value: 'iconify-icon',
  },
  {
    label: 'Unplugin Icons',
    value: 'unplugin-icons',
  },
  {
    label: 'UnoCSS',
    value: 'unocss',
  },
  {
    label: 'UnoCSS React',
    value: 'unocss-react',
  },
];

export const SettingsContent: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [form] = Form.useForm<Omit<SettingsData, 'favorIcons'>>();
  const [all] = globalStore.useStore('all');
  const GroupOptions = useMemo(() => {
    return [...all.entries()].map(([key, val]) => {
      return {
        label: val.name,
        value: key,
      };
    });
  }, [all]);

  return (
    <Form
      form={form}
      className='pt-2'
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{
        codeType: globalStore.get('codeType'),
        favorTabs: globalStore.get('favorTabs'),
        favorGroup: globalStore.get('favorGroup'),
      }}
    >
      <Form.Item label='拷贝代码类型' name='codeType'>
        <Select options={CodeTypeOptions} />
      </Form.Item>
      <Form.Item label='优先展示分类' name='favorTabs'>
        <Select options={GroupOptions} mode='multiple' />
      </Form.Item>
      <Form.Item label='默认打开分类' name='favorGroup'>
        <Select options={GroupOptions} placeholder='全部' allowClear />
      </Form.Item>
      <div className='flex justify-end gap-4'>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          取消
        </Button>
        <Button
          onClick={() => {
            void form.validateFields().then((data) => {
              if (!data.favorGroup) data.favorGroup = ''; // undefined 转成空值，才能保存到 vscode settings 里。
              Object.entries(data).forEach(([k, v]) => {
                globalStore.set(k as keyof SettingsData, v);
              });
              vscode.postMessage({
                type: 'save:settings',
                data,
              });
              onClose();
            });
          }}
          type='primary'
        >
          确认
        </Button>
      </div>
    </Form>
  );
};
export const SettingsModal: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Modal destroyOnClose footer={null} open={open} onCancel={() => onClose()} title='配置'>
      <SettingsContent onClose={onClose} />
    </Modal>
  );
};
