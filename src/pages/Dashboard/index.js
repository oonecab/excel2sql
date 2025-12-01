import React from 'react';
import { Button, Layout, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Layout className="dashboard-layout">
            <Header className="dashboard-header">
                <div className="logo">Excel2SQL</div>
                <div className="user-info">
                    <span>欢迎, {user?.username || '用户'}</span>
                    <Button type="link" onClick={() => navigate(ROUTES.PROFILE)}>
                        用户信息
                    </Button>
                    <Button type="link" onClick={logout}>
                        退出登录
                    </Button>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(ROUTES.LANDING)}
                        style={{ color: '#fff' }}
                    >
                        返回首页
                    </Button>
                </div>
            </Header>
            <Content className="dashboard-content">
                <Title level={2}>欢迎使用 Excel2SQL 转换工具</Title>
                <Paragraph>
                    这里是首页内容，后续可以添加更多功能...
                </Paragraph>
            </Content>
        </Layout>
    );
};

export default Dashboard;