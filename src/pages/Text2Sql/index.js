import React, { useState } from 'react';
import { Layout, Typography, Card, Input, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Text2Sql = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      message.warning('请输入文本描述');
      return;
    }
    setLoading(true);
    try {
      // TODO: 调用后端生成 SQL 的 API
      // const { sql } = await api.generateSqlFromText(text);
      // 先模拟结果
      await new Promise((r) => setTimeout(r, 1000));
      setSql('-- 这是模拟的 SQL 结果\nSELECT * FROM your_table WHERE ...;');
    } catch (e) {
      message.error('生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529', color: '#fff', padding: '0 50px' }}>
        <div className="logo" onClick={() => navigate('/dashboard')}>
          Text2SQL
        </div>
        <div className="user-info">
          <span>欢迎, {user?.username || '用户'}</span>
          <Button type="link" onClick={logout} style={{ color: '#fff' }}>
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

      <Content style={{ padding: 50 }}>
        <Card style={{ maxWidth: 900, margin: '0 auto' }}>
          <Title level={2}>文本转 SQL</Title>
          <Paragraph type="secondary">输入自然语言描述，生成对应的 SQL</Paragraph>

          <TextArea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例如：查询 2024 年销售额最高的前 10 个产品"
            style={{ marginTop: 16 }}
          />

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleGenerate} loading={loading}>
              生成 SQL
            </Button>
          </div>

          {sql && (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>生成结果</Title>
              <pre
                style={{
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                  padding: 12,
                  borderRadius: 4,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {sql}
              </pre>
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default Text2Sql;