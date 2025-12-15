import React, { useState } from 'react';
import { Layout, Typography, Button, Drawer, Image, Space, Grid } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import './Gallery.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;


const images = [
  'https://picsum.photos/id/1005/800/800',
  'https://picsum.photos/id/1015/800/800',
  'https://picsum.photos/id/1025/800/800',
  'https://picsum.photos/id/1035/800/800',
  'https://picsum.photos/id/1045/800/800',
  'https://picsum.photos/id/1055/800/800',
  'https://picsum.photos/id/1065/800/800',
  'https://picsum.photos/id/1075/800/800',
  'https://picsum.photos/id/13/800/800',
  'https://picsum.photos/id/237/800/800'
];

const PhotoGallery = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const openDrawer = (i) => {
    setIndex(i);
    setOpen(true);
  };
  const closeDrawer = () => setOpen(false);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <Layout className="gallery-layout">
      <Header className="gallery-header">
        <div className="logo" onClick={() => navigate(ROUTES.LANDING)}>
          相册
        </div>
        <div className="user-info">
          <span>欢迎, {user?.username || '用户'}</span>
          <Button type="link" onClick={() => navigate(ROUTES.PROFILE)}>
            用户信息
          </Button>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.LANDING)}>
            返回首页
          </Button>
          <Button type="link" onClick={logout}>
            退出登录
          </Button>
        </div>
      </Header>

      <Content className="gallery-content">
        <div className="gallery-card">
          <Title level={isMobile ? 3 : 2}>抽屉式相册</Title>
          <Paragraph type="secondary">悬停以突出显示并扩大卡片</Paragraph>

          <div className="container">
            {images.map((src, i) => (
              <div
                key={src}
                className={`card ${activeIndex === null || activeIndex === i ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => openDrawer(i)}
              >
                <div className="card-inner">
                  <picture>
                    <img src={src} alt="" loading="lazy" />
                  </picture>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Drawer
          title={`${index + 1} / ${images.length}`}
          placement="right"
          width={isMobile ? '100%' : 720}
          open={open}
          onClose={closeDrawer}
        >
          <Image
            src={images[index]}
            preview={false}
            width="100%"
            style={{ borderRadius: 8 }}
          />
          <Space style={{ marginTop: 16 }}>
            <Button icon={<LeftOutlined />} onClick={prev}>上一张</Button>
            <Button icon={<RightOutlined />} onClick={next}>下一张</Button>
          </Space>
        </Drawer>
      </Content>
    </Layout>
  );
};

export default PhotoGallery;