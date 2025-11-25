import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import { STORAGE_KEYS } from './utils/constants';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders landing page title', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Landing />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: '数据转 SQL 工具集' }))
    .toBeInTheDocument();
});

test('renders dashboard button when authenticated', () => {
  window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'test-token');
  render(
    <MemoryRouter initialEntries={['/']}>
      <Landing />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: '进入工作台' }))
    .toBeInTheDocument();
});
