import React from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

const Login = () => {
    const { login, loading } = useAuth();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { username, password, remember } = values;

        // 调用登录
        await login({
            username,
            password,
            remember
        });
    };

    return (
        <div className="login-container">
            <Card className="login-card" title="Excel2SQL 登录">
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                    layout="vertical"
                    initialValues={{ username: 'dev@local', password: '123456', remember: true }}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名或邮箱!' },
                            { min: 3, message: '用户名至少3个字符' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="用户名或邮箱"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 6, message: '密码至少6个字符' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="/forgot-password">
                            忘记密码
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading}
                            block
                        >
                            登录
                        </Button>
                        <Button
                            style={{ marginTop: 8 }}
                            block
                            onClick={() => login({ username: 'dev@local', password: '123456', remember: true })}
                        >
                            使用开发账号登录
                        </Button>
                    </Form.Item>

                    <div className="login-footer">
                        还没有账号? <a href="/register">立即注册</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;