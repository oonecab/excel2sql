import React, { useEffect, useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, message } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../api/services/authService';
import './UserProfile.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const info = await authService.getUserInfo();
        const init = {
          username: info?.username ?? user?.username ?? '',
          email: info?.email ?? user?.email ?? ''
        };
        form.setFieldsValue(init);
      } catch {
        const init = {
          username: user?.username ?? '',
          email: user?.email ?? ''
        };
        form.setFieldsValue(init);
      }
    };
    fetch();
  }, [form, user]);

  const onFinish = async (values) => {
    const { username, email } = values;
    setLoading(true);
    try {
      const resp = await authService.updateUserInfo({ username, email });
      const next = resp?.userInfo ?? { username, email };
      updateUser(next);
      message.success('保存成功');
    } catch (e) {
      message.error(e?.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="profile-layout">
      <Header className="profile-header">
        <div className="logo">账户信息</div>
        <div className="user-info">
          <span>{user?.username || '用户'}</span>
          <Button type="link" onClick={logout}>退出登录</Button>
        </div>
      </Header>
      <Content className="profile-content">
        <Card className="profile-card" title={<Title level={3} style={{ margin: 0 }}>编辑个人信息</Title>}>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '邮箱格式不正确' }
              ]}
            >
              <Input placeholder="邮箱" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default UserProfile;