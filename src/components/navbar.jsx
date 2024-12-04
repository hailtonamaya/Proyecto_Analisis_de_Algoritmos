import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';  // Usar Outlet para las rutas
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Opciones del menú con las rutas correctas
  const menuItems = [
    { key: 'hailton', icon: <UserOutlined />, label: 'Hailton', path: '/hailton' },
    { key: 'ricardo', icon: <VideoCameraOutlined />, label: 'Ricardo', path: '/ricardo' },
    { key: 'jose', icon: <UploadOutlined />, label: 'Jose', path: '/jose' },
    { key: 'steve', icon: <UserOutlined />, label: 'Steve', path: '/steve' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Barra lateral */}
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['hailton']} // Establecer la opción seleccionada por defecto
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Layout principal */}
      <Layout>
        {/* Cabecera */}
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        {/* Contenido */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Aquí se renderizan las rutas dinámicas */}
          <Outlet /> {/* Renderiza las rutas dinámicas aquí */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
