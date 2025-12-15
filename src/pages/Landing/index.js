import React from 'react';
import { Button, Layout, Typography, Card, Row, Col, Grid } from 'antd'
import { FileExcelOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/storage';
import { ROUTES } from '../../utils/constants';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const Landing = () => {
    const navigate = useNavigate();
    const isLoggedIn = isAuthenticated();
    const screens = useBreakpoint();
    const isMobile = screens.xs;

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
            <Header style={{ background: '#fff', 
                             padding: isMobile ? '0 16px' : '0 50px',
                             paddingTop: 'var(--safe-top)' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 8,
                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                }}>
                    <div className="logo">Excel2SQL</div>
                    <div>
                        {isLoggedIn ? (
                            <>
                                <Button type="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
                                    进入工作台
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => navigate(ROUTES.PROFILE)}>
                                    用户信息
                                </Button>
                            </>
                        ) : (
                            <Button type="primary" onClick={() => navigate(ROUTES.LOGIN)}>
                                登录
                            </Button>
                        )}
                    </div>
                </div>
            </Header>
            <Content style={{ padding: isMobile ? 16 : 50, textAlign: 'center' }}>
                <Title level={isMobile ? 3 : 2}>数据转 SQL 工具集</Title>
                <Paragraph>选择功能以开始使用</Paragraph>

                {/* 页面中心的两个悬浮卡片 */}
                <div
                    style={{
                        position: 'relative'
                    }}
                >
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                onClick={goExcel2Sql}
                                style={{ width: '100%' }}
                            >
                                <div style={{ fontSize: 48, color: '#52c41a' }}>
                                    <FileExcelOutlined />
                                </div>
                                <Title level={3} style={{ marginTop: 12 }}>
                                    Excel2SQL
                                </Title>
                                <Paragraph type="secondary">上传 Excel/CSV 并生成 SQL</Paragraph>
                            </Card>
                        </Col>


                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                onClick={goText2Sql}
                                style={{ width: '100%' }}
                            >
                                <div style={{ fontSize: 48, color: '#1890ff' }}>
                                    <FileTextOutlined />
                                </div>
                                <Title level={3} style={{ marginTop: 12 }}>
                                    Text2SQL
                                </Title>
                                <Paragraph type="secondary">输入文本描述并生成 SQL</Paragraph>
                            </Card>
                        </Col>


                        <Col xs={24} sm={12} md={8}>
                            <Card hoverable onClick={goGallery} style={{ width: '100%' }}>
                                <div style={{ fontSize: 48, color: '#eb2f96' }}>
                                    <PictureOutlined />
                                </div>
                                <Title level={3} style={{ marginTop: 12 }}>
                                    相册
                                </Title>
                                <Paragraph type="secondary">抽屉式预览与切换</Paragraph>
                            </Card>
                        </Col>

                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default Landing;