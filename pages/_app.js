import 'reset.css'
import './_app.less'
import '../assets/nprogress.css'

import { Breadcrumb, Layout, Menu, ConfigProvider } from 'antd'
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'

import App from 'next/app'
import { withApollo } from '@aplo/client'
import React, { useContext } from 'react'
import Router from 'next/router'
import request, { post } from '@js/request'
import NProgress from 'nprogress'
import zhCN from 'antd/lib/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

// //at.alicdn.com/t/font_602462_70iys4kliwg.js
const GlobalContext = React.createContext({})

export const useGlobal = () => useContext(GlobalContext)

Router.events.on('routeChangeStart', url => {
  console.log('Loading...', url)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //

  static contextType = GlobalContext

  static async getInitialProps(appContext) {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext)
    // const userinfo = await request(appContext.ctx).get('/api/get-userinfo')
    // console.log('--userinfo---', userinfo)
    return { ...appProps, globalContext: {} }
  }

  state = {
    collapsed: false
  }

  logout = async () => {
    const res = await post('/api/logout')
    if (res) {
      Router.replace('/user/login')
    }
  }

  render() {
    const { Component, pageProps, globalContext } = this.props
    const { collapsed } = this.state
    return (
      <ConfigProvider locale={zhCN}>
        <GlobalContext.Provider value={globalContext}>
          <Layout>
            <Header className="app-header">
              {/* <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu> */}
              <span className="logout" onClick={this.logout}>
                <LogoutOutlined />
                退出
              </span>
            </Header>
            {/* TODO: remove this style */}
            <Layout style={{ flexDirection: 'row' }}>
              <Sider width={200} className="site-layout-background">
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu
                    key="sub1"
                    title={
                      <span>
                        <UserOutlined />
                        subnav 1
                      </span>
                    }
                  >
                    <Menu.Item key="1">option1</Menu.Item>
                    <Menu.Item key="2">option2</Menu.Item>
                    <Menu.Item key="3">option3</Menu.Item>
                    <Menu.Item key="4">option4</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub2"
                    title={
                      <span>
                        <LaptopOutlined />
                        subnav 2
                      </span>
                    }
                  >
                    <Menu.Item key="5">option5</Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    title={
                      <span>
                        <NotificationOutlined />
                        subnav 3
                      </span>
                    }
                  >
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                  className="site-layout-background"
                  style={{
                    margin: 0,
                    minHeight: 280
                  }}
                >
                  <Component {...pageProps} />
                </Content>
              </Layout>
            </Layout>
            <style jsx global>{`
              .app-header {
                color: #fff;
              }
              .app-header .logout {
                cursor: pointer;
              }
              .logout .anticon-logout {
                padding-right: 5px;
              }
            `}</style>
          </Layout>
        </GlobalContext.Provider>
      </ConfigProvider>
    )
  }
}

export default withApollo(MyApp)
