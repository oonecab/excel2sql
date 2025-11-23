import React from 'react';
import { Button, Layout, Typography, Card, Space } from 'antd';
import { FileExcelOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/storage';
import { ROUTES } from '../../utils/constants';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Landing = () => {
    const navigate = useNavigate();
    const isLoggedIn = isAuthenticated();

    const handleGetStarted = () => {
        if (isLoggedIn) {
            navigate(ROUTES.DASHBOARD);
        } else {
            navigate(ROUTES.LOGIN);
        }
    };

    const goExcel2Sql = () => {
        if (isLoggedIn) {
            navigate(ROUTES.EXCEL2SQL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    };
    const goText2Sql = () => {
        if (isLoggedIn) {
            navigate(ROUTES.TEXT2SQL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    };

    const goGallery = () => {
        if (isLoggedIn) {
            navigate(ROUTES.GALLERY);
        } else {
            navigate(ROUTES.LOGIN);
        }
    };

    return (
        <Layout>
            <Header style={{ background: '#fff', padding: '0 50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="logo">Excel2SQL</div>
                    <div>
                        {isLoggedIn ? (
                            <Button type="primary" onClick={() =>
                                navigate(ROUTES.DASHBOARD)}>
                                进入工作台
                            </Button>
                        ) : (
                            <Button type="primary" onClick={() =>
                                navigate(ROUTES.LOGIN)}>
                                登录
                            </Button>
                        )}
                    </div>
                </div>
            </Header>
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <Title>数据转 SQL 工具集</Title>
                <Paragraph>选择功能以开始使用</Paragraph>

                {/* 页面中心的两个悬浮卡片 */}
                <div
                    style={{
                        position: 'relative',
                        height: '50vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Space size="large" align="center">
                        <Card
                            hoverable
                            onClick={goExcel2Sql}
                            style={{
                                width: 260,
                                paddingTop: 12,
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: 48, color: '#52c41a' }}>
                                <FileExcelOutlined />
                            </div>
                            <Title level={3} style={{ marginTop: 12 }}>
                                Excel2SQL
                            </Title>
                            <Paragraph type="secondary">上传 Excel/CSV 并生成 SQL</Paragraph>
                        </Card>

                        <Card
                            hoverable
                            onClick={goText2Sql}
                            style={{
                                width: 260,
                                paddingTop: 12,
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: 48, color: '#1890ff' }}>
                                <FileTextOutlined />
                            </div>
                            <Title level={3} style={{ marginTop: 12 }}>
                                Text2SQL
                            </Title>
                            <Paragraph type="secondary">输入文本描述并生成 SQL</Paragraph>
                        </Card>

                        <Card hoverable onClick={goGallery} style={{ width: 260, paddingTop: 12, position: 'relative' }}>
                            <div style={{ fontSize: 48, color: '#eb2f96' }}>
                                <PictureOutlined />
                            </div>
                            <Title level={3} style={{ marginTop: 12 }}>
                                相册
                            </Title>
                            <Paragraph type="secondary">抽屉式预览与切换</Paragraph>
                        </Card>
                    </Space>
                </div>

                {/* 可保留原来的“开始使用”按钮作为兜底入口 */}
                <Button type="primary" size="large" onClick={handleGetStarted}>
                    开始使用
                </Button>
            </Content>
        </Layout>
    );
};

export default Landing;