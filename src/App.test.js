import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page logo', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '数据转 SQL 工具集' })).toBeInTheDocument();
});

test('renders get started button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: '开始使用' })).toBeInTheDocument();
});
