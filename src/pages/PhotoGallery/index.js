import React, { useState } from 'react';
import { Layout, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './Gallery.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

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

  return (
    <Layout className="gallery-layout">
      <Header className="gallery-header">
        <div className="logo" onClick={() => navigate(ROUTES.LANDING)}>
          相册
        </div>
        <div className="user-info">
          <span>欢迎, {user?.username || '用户'}</span>
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
          <Title level={2}>抽屉式相册 2.0</Title>
          <Paragraph type="secondary">悬停以突出显示并扩大卡片</Paragraph>

          <div className="container">
            {images.map((src, i) => (
              <div
                key={src}
                className={`card ${activeIndex === null || activeIndex === i ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
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
      </Content>
    </Layout>
  );
};

export default PhotoGallery;