import Link from 'next/link'
import CardList from '../components/CardList'
import axios from 'axios'
import { Menu, Icon, Layout, Slider } from 'antd'
import { useState } from 'react'
const { Header, Content, Sider } = Layout
const { SubMenu } = Menu

export default function Index(props) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setCollapsed(prev => !prev)}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280
          }}
        >
          Content
        </Content>
      </Layout>
      <style jsx global>{`
        .anticon-menu-unfold.trigger,
        .anticon-menu-fold.trigger {
          font-size: 20px;
        }
      `}</style>
    </Layout>
  )
}
