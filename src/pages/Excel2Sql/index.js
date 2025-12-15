import React, { useState } from 'react';
import {
  Upload as AntUpload,
  Button,
  message,
  Layout,
  Card,
  Typography,
  Space,
  Table,
  Tag,
  Select,
  Input,
  Divider,
  Grid
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import './Excel2Sql.css';
import * as excelService from '../../api/services/excelService';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = AntUpload;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const DB_OPTIONS = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'pgsql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'SQLite', value: 'sqlite' }
];

const normalizeTableName = (fileName) =>
  fileName
    .replace(/\.[^.]+$/, '')      // 去扩展名
    .trim()                       // 去首尾空格
    .replace(/\s+/g, '_');

const Excel2Sql = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dbType, setDbType] = useState(null);
  const [tableNames, setTableNames] = useState({});
  const [results, setResults] = useState([]);
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx,.xls,.csv',
    fileList,
    beforeUpload: (file) => {
      const ext = (file.name || '').toLowerCase();
      const byExt = ext.endsWith('.xlsx') || ext.endsWith('.xls') || ext.endsWith('.csv');
      const byType =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'text/csv';
      const isExcel = byExt || byType;
      if (!isExcel) {
        message.error('只能上传 Excel 或 CSV 文件');
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过 100MB');
        return false;
      }
      // const next = [...fileList, file];
      setFileList((prev) => {
        const exists = prev.some((f) =>
          f.uid === file.uid || (f.name === file.name && f.size === file.size)
        );
        if (exists) return prev;
        return [...prev, file];
      });
      setTableNames((prev) => ({
        ...prev,
        [file.uid]: prev[file.uid] ?? normalizeTableName(file.name) // 直接回填默认表名
      }));
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const next = fileList.slice();
      next.splice(index, 1);
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
      setTableNames((prev) => {
        const copy = { ...prev };
        delete copy[file.uid];
        return copy;
      });
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch {
      message.error('复制失败，请手动选择复制');
    }
  };

  const handleUpload = async () => {
    if (!dbType) {
      message.warning('请选择数据库类型');
      return;
    }
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }
    setUploading(true);

    const finalTables = fileList.map((f) => ({
      fileName: f.name,
      tableName: (tableNames[f.uid]?.trim()) || normalizeTableName(f.name)
    }));

    const formData = new FormData();
    fileList.forEach((file) => formData.append('files', file));

    const payload = { dbType, tables: finalTables };

    try {

      const resp = await excelService.uploadExcel(formData, payload);
      const resultsRaw = resp?.results || resp?.data?.results || [];
      const formatted = resultsRaw.map((r) => ({
        ...r,
        createSqlText: r.createSql || '',
        insertSqlText: Array.isArray(r.insertSql) ? r.insertSql.join('\n') : (r.insertSql || '')
      }));
      setResults(formatted);
      message.success(resp?.message || '转换成功');
    } catch (error) {
      message.error('上传失败: ' + (error?.message || '未知错误'));
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFileList([]);
    setTableNames({});
    setResults([]);
    setDbType(null);
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <FileExcelOutlined style={{ color: '#52c41a' }} />
          {text}
        </Space>
      )
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024).toFixed(2)} KB`
    },
    {
      title: '表名',
      key: 'tableName',
      render: (_, record) => {
        const defaultName = normalizeTableName(record.name);
        const value = (tableNames[record.uid] ?? defaultName); // 使用回填默认值
        return (
          <Input
            className="table-name-input"
            value={value}
            onChange={(e) =>
              setTableNames((prev) => ({ ...prev, [record.uid]: e.target.value }))
            }
            onBlur={(e) => {
              const entered = (e.target.value || '').trim();
              const defaultName = normalizeTableName(record.name);
              const invalid = !entered || /^_+$/.test(entered);
              setTableNames((prev) => ({ ...prev, [record.uid]: invalid ? defaultName : entered }));
            }}
          />
        );
      }
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Tag color="blue">待上传</Tag>
    }
  ];

  const renderResultItem = (item, idx) => {
    const allSql = [item.createSqlText, item.insertSqlText].filter(Boolean).join('\n\n');
    return (
      <Card key={idx} className="result-card" title={`${item.fileName}（${item.sheetName || '未命名工作表'}）`}>
        <Space wrap>
          <Button icon={<CopyOutlined />} onClick={() => copyText(item.createSqlText)} disabled={!item.createSqlText}>
            复制建表
          </Button>
          <Button icon={<CopyOutlined />} onClick={() => copyText(item.insertSqlText)} disabled={!item.insertSqlText}>
            复制插入
          </Button>
          <Button type="primary" icon={<CopyOutlined />} onClick={() => copyText(allSql)} disabled={!allSql.trim()}>
            复制全部
          </Button>
        </Space>

        <div className="sql-section">
          <Typography.Text strong>建表语句</Typography.Text>
          <TextArea
            className="sql-textarea"
            value={item.createSqlText}
            onChange={(e) =>
              setResults((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], createSqlText: e.target.value };
                return next;
              })
            }
            autoSize={{ minRows: 4, maxRows: 12 }}
            placeholder="CREATE TABLE ..."
          />
        </div>

        <Divider />

        <div className="sql-section">
          <Typography.Text strong>插入语句</Typography.Text>
          <TextArea
            className="sql-textarea"
            value={item.insertSqlText}
            onChange={(e) =>
              setResults((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], insertSqlText: e.target.value };
                return next;
              })
            }
            autoSize={{ minRows: 6, maxRows: 24 }}
            placeholder="INSERT INTO ..."
          />
        </div>
      </Card>
    );
  };

  const copyAllFilesSql = () => {
    if (!results.length) return;
    const merged = results
      .map((r) => [`-- ${r.fileName} | ${r.sheetName || ''}`, r.createSqlText, r.insertSqlText].filter(Boolean).join('\n'))
      .join('\n\n');
    copyText(merged);
  };

  return (
    <Layout className="upload-layout">
      <Header className="excel2sql-header" style={{ paddingTop: 'var(--safe-top)', padding: isMobile ? '0 16px' : '0 50px' }}>
        <div className="logo" onClick={() => navigate(ROUTES.LANDING)}>Excel2SQL</div>
        <div className="user-info">
          <span>欢迎, {user?.username || '用户'}</span>
          <Button type="link" onClick={() => navigate(ROUTES.PROFILE)}>用户信息</Button>
          <Button type="link" onClick={logout}>退出登录</Button>
        </div>
      </Header>

      <Content className="excel2sql-content">
        <Card className="excel2sql-card">
          <Title level={2}>上传 Excel 文件并配置转换</Title>
          <Paragraph type="secondary">支持格式：.xlsx, .xls, .csv | 最大文件大小：100MB</Paragraph>

          <div className="db-form-row"
            style={{
              flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center'
            }}>
            <span className="db-form-label">数据库类型</span>
            <Select
              className="db-select"
              placeholder="请选择数据库"
              options={DB_OPTIONS}
              value={dbType}
              onChange={setDbType}
            />
          </div>

          <Dragger {...uploadProps} className="upload-dragger" style={{ width: '100%' }}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">可批量上传；未填写表名时默认取文件名（去扩展名）</p>
          </Dragger>

          {fileList.length > 0 && (
            <div className="file-list-section">
              <Title level={4}>已选择的文件 ({fileList.length})</Title>
              <Table columns={columns}
                dataSource={fileList}
                rowKey="uid"
                pagination={false} scroll={{ x: 'max-content' }}
                size={isMobile ? 'small' : 'middle'} />

              <Space style={{ marginTop: 16 }} direction={isMobile ? 'vertical' : 'horizontal'}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={fileList.length === 0 || !dbType}
                  block={isMobile}
                >
                  {uploading ? '上传中...' : '开始上传'}
                </Button>
                <Button icon={<DeleteOutlined />} onClick={handleClear} disabled={uploading} block={isMobile}>
                  清空列表
                </Button>
              </Space>
            </div>
          )}
        </Card>

        {results.length > 0 && (
          <Card className="result-wrapper">
            <Space style={{ marginBottom: 12 }}>
              <Title level={3} style={{ margin: 0 }}>转换结果</Title>
              <Button type="primary" icon={<CopyOutlined />} onClick={copyAllFilesSql}>
                复制所有文件 SQL
              </Button>
            </Space>
            {results.map((item, idx) => renderResultItem(item, idx))}
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default Excel2Sql;