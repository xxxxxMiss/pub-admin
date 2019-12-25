import { useState, useEffect } from 'react'
import { Button, Drawer, Form, Col, Row, Input, message, Table } from 'antd'
import { get, post } from '@js/request'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRouter } from 'next/router'

const columns = [
  {
    title: '应用名称',
    dataIndex: 'appName',
    sorter: true,
    width: '20%'
  },
  {
    title: 'Git地址',
    dataIndex: 'appGitAddr',
    render: text => {
      return (
        <CopyToClipboard onCopy={() => message.success('复制成功')} text={text}>
          <span>
            {text}
            <Button>复制</Button>
          </span>
        </CopyToClipboard>
      )
    }
  },
  {
    title: '应用语言',
    dataIndex: 'appLanguage',
    width: '20%'
  }
]

export default function Application(props) {
  const [drawerVisible, setDrawerVisible] = useState(false)

  const onFinish = values => {
    post('/api/create-application', values).then(res => {
      if (res) {
        message.success('创建成功')
        setDrawerVisible(false)
        getData()
      }
    })
  }

  const [data, setData] = useState(props.data || [])
  const [pagination, setPagination] = useState({})

  function getData() {
    get('api/get-applications').then(res => {
      if (res) {
        setData(res)
      }
    })
  }

  function handleTableChange(pagination, filters, sorter) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    getData({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  const router = useRouter()

  return (
    <div className="page-application">
      <div className="header-container">
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          创建应用
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={record => record._id}
        dataSource={data}
        pagination={pagination}
        // loading={this.state.loading}
        onChange={handleTableChange}
        onRow={row => {
          return {
            onClick: event => {
              event.persist()
              if (event.target.tagName === 'TD') {
                router.push('/build')
              }
            }
          }
        }}
      />
      <Drawer
        width={720}
        className="application-drawer"
        title="创建应用"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="应用名称" name="appName" required>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="应用说明" name="appDesc">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Git地址" name="appGitAddr" required>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="使用语言" name="appLanguage" required>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <div className="btn-group">
              <Button onClick={() => setDrawerVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
      <style jsx global>{`
        .application-drawer .btn-group {
          border-top: 1px solid #e9e9e9;
          padding-top: 10px;
          margin-top: 30px;
          text-align: right;
        }
        .application-drawer .btn-group .ant-btn + .ant-btn {
          margin-left: 15px;
        }
      `}</style>
    </div>
  )
}
Application.getInitialProps = async () => {
  const res = await get('api/get-applications')
  return {
    data: res || {}
  }
}
