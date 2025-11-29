import React, { useState } from 'react';
import { Layout, Typography, Card, Input, Button, message, Upload, Select, Space } from 'antd';
import { ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import * as text2sqlService from '../../api/services/text2sqlService';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const DB_OPTIONS = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'pgsql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'SQLite', value: 'sqlite' }
];

const Text2Sql = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingSchema, setUploadingSchema] = useState(false);
  const [dbType, setDbType] = useState(null);
  const [schemaJson, setSchemaJson] = useState(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      message.warning('请输入文本描述');
      return;
    }
    setLoading(true);
    try {
      const resp = await text2sqlService.generateSql({
        requirements: text,
        schema: schemaJson,
        dbType
      });
      const finalSql = resp?.sql ?? resp?.data?.sql ?? '';
      setSql(finalSql);
    } catch (e) {
      message.error(e?.message || '生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    beforeUpload: async (file) => {
      const ext = (file.name || '').toLowerCase();
      const byExt = ext.endsWith('.xlsx') || ext.endsWith('.xls');
      const byType =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      const isExcel = byExt || byType;
      if (!isExcel) {
        message.error('只能上传 Excel 文件');
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过 100MB');
        return false;
      }
      if (!dbType) {
        message.warning('请先选择数据库类型');
        return false;
      }
      setUploadingSchema(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dbType', dbType);
        const resp = await text2sqlService.uploadSchemaExcel(formData);
        const parsedSchema = resp?.schema ?? resp?.data?.schema ?? resp;
        setSchemaJson(parsedSchema);
        message.success('表结构解析成功');
        if (text.trim()) {
          setLoading(true);
          try {
            const gen = await text2sqlService.generateSql({
              requirements: text,
              schema: parsedSchema,
              dbType
            });
            const finalSql = gen?.sql ?? gen?.data?.sql ?? '';
            setSql(finalSql);
          } catch (e) {
            message.error(e?.message || '生成失败，请稍后重试');
          } finally {
            setLoading(false);
          }
        } else {
          message.info('已解析表结构，请输入需求后生成');
        }
      } catch (e) {
        message.error(e?.message || '解析失败，请稍后重试');
      } finally {
        setUploadingSchema(false);
      }
      return false;
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
          <Paragraph type="secondary">上传表结构并输入需求，自动生成 SQL</Paragraph>

          <Space style={{ marginTop: 12 }}>
            <span>数据库类型</span>
            <Select
              placeholder="请选择数据库"
              options={DB_OPTIONS}
              value={dbType}
              onChange={setDbType}
              style={{ minWidth: 220 }}
            />
          </Space>

          <Dragger {...uploadProps} style={{ marginTop: 16 }}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽 Excel 文件到此区域上传</p>
            <p className="ant-upload-hint">支持 .xlsx/.xls | 最大 100MB</p>
          </Dragger>

          <TextArea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例如：查询 2024 年销售额最高的前 10 个产品"
            style={{ marginTop: 16 }}
          />

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleGenerate} loading={loading || uploadingSchema} disabled={uploadingSchema}>
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