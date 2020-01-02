import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Table,
  message
} from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { get, post } from '@js/request'
import { useEffect, useState } from 'react'
import { IconFont } from '@components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRouter } from 'next/router'

async function handleCollecton(appid) {
  const res = await post('/api/collect-application', { appid })
  if (res) {
    message.success('收藏成功')
  }
}

const columns = [
  {
    title: '应用名称',
    dataIndex: 'appName',
    sorter: true,
    width: '20%',
    render: (text, record) => {
      return (
        <>
          <IconFont
            type="iconcollect_outlined"
            onClick={() => handleCollecton(record._id)}
          />
          <span>{text}</span>
        </>
      )
    }
  },
  {
    title: 'Git地址',
    dataIndex: 'appGitAddr',
    sorter: true,
    render: text => {
      return (
        <CopyToClipboard onCopy={() => message.success('复制成功')} text={text}>
          <span>
            {text}
            <CopyOutlined />
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
  const [pagination, setPagination] = useState(props.pagination)

  function getData(params) {
    get('api/get-applications', {
      params
    }).then(res => {
      if (res) {
        setData(res.list)
      }
    })
  }

  function handleTableChange(paginationCfg, _, sorter) {
    console.log('=====', sorter)
    setPagination(prev => ({ ...prev, page: paginationCfg.current }))

    const params = {
      page: paginationCfg.current,
      pageSize: 2
    }
    if (sorter.field) {
      params.sortField = sorter.field
      params.sortOrder = sorter.order
    }
    getData(params)
  }

  function handleCheck(e) {
    getData({
      collect: e.target.checked
    })
  }
  const router = useRouter()

  return (
    <div className="page-application">
      <div className="header-container">
        <Checkbox onChange={handleCheck}>我的收藏</Checkbox>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          创建应用
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={record => record._id}
        dataSource={data}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          hideOnSinglePage: true
        }}
        onChange={handleTableChange}
        onRow={_ => {
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
  const { list = [], ...pagination } =
    (await get('api/get-applications', {
      params: {
        pageSize: 2,
        page: 1
      }
    })) || {}
  return {
    data: list,
    pagination
  }
}
