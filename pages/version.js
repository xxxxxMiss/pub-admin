import {
  Button,
  Row,
  Col,
  Drawer,
  Form,
  Input,
  Select,
  Cascader,
  message,
  Table,
  Popover
} from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import request, { get, post } from '@js/request'
import dayjs from 'dayjs'
import useSocket from '@hooks/useSocket'
import dynamic from 'next/dynamic'
import VersionPrecondition from '@components/VersionPrecondition'
import VersionBuildStage from '@components/VersionBuildStage'
import {
  LoadingOutlined,
  CheckCircleTwoTone,
  DownloadOutlined,
  PauseOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { versionJoiSchema } from '@js/validation'

const HighlightNoSSR = dynamic(() => import('@components/Highlight'), {
  ssr: false
})

export default function Version(props) {
  const columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      width: '20%',
      className: 'wrap-column'
    },
    {
      title: '版本名称',
      dataIndex: 'name',
      width: '20%',
      className: 'wrap-column'
    },
    {
      title: '编译状态',
      dataIndex: 'status',
      width: '30%',
      render(text, record) {
        const status = record.status
        return (
          <Row gutter={15}>
            {status.map((s, i) => (
              <Col key={i}>
                <p>{i === 0 ? 'FAT' : i === 1 ? 'UAT' : 'PRO'}</p>
                {s === 0 ? (
                  <LoadingOutlined />
                ) : s === 'success' ? (
                  <CheckCircleTwoTone />
                ) : s === 'aborted' ? (
                  <PauseOutlined />
                ) : s === 'empty' ? (
                  '-'
                ) : (
                  <WarningOutlined />
                )}
              </Col>
            ))}
            {/* <Col>
              <p>UAT</p>
              <LoadingOutlined />
            </Col>
            <Col>
              <p>PRO</p>
              <LoadingOutlined />
            </Col> */}
          </Row>
        )
      }
    },
    {
      title: 'FAT',
      dataIndex: 'FAT',
      width: '20%',
      render(text, record) {
        return <CheckCircleTwoTone />
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      render(text, record) {
        return (
          <Button type="ghost" onClick={() => viewLog(record.version)}>
            查看日志
          </Button>
        )
      }
    }
  ]
  const router = useRouter()
  const [form] = Form.useForm()

  const [visible, setVisible] = useState(false)
  const [buildInfo, setBuildInfo] = useState([])
  const [nodeVersions, setNodeVersions] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  const socket = useSocket('build:info', buildinfo => {
    setModalContent(buildinfo)
  })

  async function viewLog(version) {
    setModalVisible(true)
    const log = await get('/api/get-build-log', {
      params: {
        version
      }
    })
    setModalContent(log)
  }

  async function addNewVersion() {
    setVisible(true)
    const info = await get('/api/get-create-build-info', {
      params: {
        appid: router.query.appid
      }
    })
    const nodeVersion = await get('/api/get-node-versions')
    setBuildInfo(info || [])
    setNodeVersions(nodeVersion || [])
  }

  const formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 }
  }

  const [commitMsg, setCommitMsg] = useState('')
  function handleBranchChange(value, options) {
    setCommitMsg(options[1]?.message || '')
    form.setFieldsValue({
      branch_commit: value
    })
  }

  async function onFinish(values) {
    const [branch, commit] = values.branch_commit
    values.branch = branch
    values.commit = commit
    values.appid = router.query.appid
    Reflect.deleteProperty(values, 'branch_commit')

    const { error } = versionJoiSchema.validate(values)
    if (error) {
      console.log(error.details)
      return message.error(error.message)
    }

    confirm()
    const res = await post('/api/create-new-version', values)
    if (res) {
      message.success('新增版本成功')
    }
  }

  let end = false
  useSocket('build:end', () => {
    end = true
    socket.close()
  })
  function confirm() {
    setVisible(false)
    setModalVisible(true)
    const interval = setInterval(() => {
      if (end) {
        clearInterval(interval)
      } else {
        socket.emit('build:info')
      }
    }, 1500)
  }

  return (
    <div className="page-version">
      <div className="header-container">
        <Button type="primary" onClick={addNewVersion}>
          新增版本
        </Button>
      </div>
      <Row gutter={10}>
        <Col span={14}>
          <Table
            onRow={(_, index) => {
              return {
                onClick: () => {
                  setCurrentIndex(index)
                }
              }
            }}
            rowClassName={(_, index) => {
              return currentIndex === index ? 'row-selected' : ''
            }}
            columns={columns}
            dataSource={props.data}
            // scroll={{ y: 500 }}
          ></Table>
        </Col>
        <Col span={10}>
          <VersionPrecondition {...props.data[currentIndex]} />
          <VersionBuildStage {...props.data[currentIndex]} />
        </Col>
      </Row>
      <HighlightNoSSR
        modalVisible={modalVisible}
        modalContent={modalContent}
        setModalVisible={setModalVisible}
      />
      <Drawer
        visible={visible}
        closable
        width={560}
        onClose={() => setVisible(false)}
        className="version-drawer"
        title="新增版本"
        maskClosable={false}
        destroyOnClose
      >
        <div className="drawer-header">
          <span>应用名称：{router.query.appName}</span>
          <span>应用ID：{router.query.appid}</span>
        </div>
        <Form
          form={form}
          initialValues={{
            buildTool: 'npm',
            version: dayjs().format('YYYYMMDDHHmmss'),
            gitUrl: router.query.gitUrl
          }}
          onFinish={onFinish}
          {...formLayout}
          labelAlign="left"
        >
          <Form.Item label="版本号" name="version">
            <Input disabled />
          </Form.Item>
          <Form.Item label="版本名称" name="name" required>
            <Input placeholder="请输入版本名称" />
          </Form.Item>
          <Form.Item label="Node版本" name="nodeVersion" required>
            <Select defaultValue={nodeVersions[0]} placeholder="请选择node版本">
              {nodeVersions.map(val => (
                <Select.Option key={val} value={val}>
                  {val}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input placeholder="对此次构建的简单描述" />
          </Form.Item>
          <Form.Item label="git地址" name="gitUrl">
            <Input disabled />
          </Form.Item>
          <Form.Item label="分支/Commit" name="branch_commit">
            <Cascader
              options={buildInfo}
              expandTrigger="hover"
              placeholder="请选择要发布的分支/Commit"
              onChange={handleBranchChange}
            />
            <div className="commit-msg">{commitMsg}</div>
          </Form.Item>
          <Form.Item label="打包工具" name="buildTool">
            <Select
              defaultValue="npm"
              onChange={value =>
                form.setFieldsValue({
                  buildInfo: value
                })
              }
            >
              <Select.Option value="npm">npm</Select.Option>
              <Select.Option value="yarn">yarn</Select.Option>
            </Select>
          </Form.Item>
          <div className="btn-group">
            <Button size="large" onClick={() => setVisible(false)}>
              取消
            </Button>
            <Button size="large" type="primary" htmlType="submit">
              确定
            </Button>
          </div>
        </Form>
      </Drawer>
      <style jsx global>{`
        .page-version .wrap-column {
          word-break: break-all;
        }
        .page-version .row-selected > td {
          background-color: #f5f5f5;
        }
        .version-drawer .commit-msg {
          margin-top: 10px;
          padding: 0 10px;
          color: #999;
        }
        .version-drawer .btn-group {
          text-align: right;
          padding-top: 30px;
        }
        .version-drawer .btn-group .ant-btn + .ant-btn {
          margin-left: 15px;
        }
        .version-drawer .drawer-header {
          padding-bottom: 25px;
        }
        .version-drawer .ant-drawer-body {
          padding: 24px 34px;
        }
        .version-drawer .drawer-header span + span {
          padding-left: 15px;
        }
      `}</style>
    </div>
  )
}
//
Version.getInitialProps = async ctx => {
  const data = await request(ctx).get('/api/get-pkg-list', {
    params: {
      appid: ctx.query.appid
    }
  })
  return { data: data || [] }
}
