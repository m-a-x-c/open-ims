import { HomeOutlined } from '@ant-design/icons';
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
];
