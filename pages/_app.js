import React from 'react'
import App from 'next/app'

import './_app.less'

import Link from 'next/link'
import CardList from '../components/CardList'
import axios from 'axios'
import { Menu, Icon, Layout, Slider } from 'antd'
import { useState } from 'react'
const { Header, Content, Sider } = Layout
const { SubMenu } = Menu

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  state = {
    collapsed: false
  }

  render() {
    const { Component, pageProps } = this.props
    const { collapsed } = this.state
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
              onClick={() =>
                this.setState({
                  collapsed: !collapsed
                })
              }
            />
            <div className="test">1111</div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280
            }}
          >
            <Component {...pageProps} />
          </Content>
        </Layout>
        <style jsx global>{`
          .anticon-menu-unfold.trigger,
          .anticon-menu-fold.trigger {
            font-size: 20px;
          }
          .test {
            height: 50px;
            background: #999;
          }
        `}</style>
      </Layout>
    )
  }
}

export default MyApp
