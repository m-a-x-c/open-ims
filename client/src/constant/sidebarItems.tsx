import { HomeOutlined, PlusOutlined, AppstoreOutlined, TeamOutlined } from '@ant-design/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle: React.CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 500,
};

export const sidebarItems = [
  {
    key: 'Dashboard',
    label: <NavLink to='/' style={linkStyle}>Dashboard</NavLink>,
    icon: React.createElement(HomeOutlined),
  },
  {
    key: 'Add Product',
    label: <NavLink to='/create-product' style={linkStyle}>Add product</NavLink>,
    icon: React.createElement(PlusOutlined),
  },
  {
    key: 'Manage Products',
    label: <NavLink to='/products' style={linkStyle}>Products</NavLink>,
    icon: React.createElement(AppstoreOutlined),
  },
  {
    key: 'Manage Seller',
    label: <NavLink to='/sellers' style={linkStyle}>Sellers</NavLink>,
    icon: React.createElement(TeamOutlined),
  },
];
