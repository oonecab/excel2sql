import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Excel2Sql from './pages/Excel2Sql';
import Text2SQL from './pages/Text2Sql';
import PhotoGallery from './pages/PhotoGallery';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES } from './utils/constants';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.TEXT2SQL}
            element={
              <PrivateRoute>
                <Text2SQL />
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.EXCEL2SQL}
            element={
              <PrivateRoute>
                <Excel2Sql />
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.GALLERY}
            element={
              <PrivateRoute>
                <PhotoGallery />
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.PROFILE}
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;