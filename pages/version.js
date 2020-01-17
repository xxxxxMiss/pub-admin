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
  Modal
} from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import request, { get, post } from '@js/request'
import dayjs from 'dayjs'
import useSocket from '@hooks/useSocket'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function Version(props) {
  const router = useRouter()
  const [form] = Form.useForm()

  const [visible, setVisible] = useState(false)
  const [buildInfo, setBuildInfo] = useState([])
  const [nodeVersions, setNodeVersions] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const socket = useSocket('build:info', buildinfo => {
    setModalContent(buildinfo)
  })

  async function addNewVersion() {
    setVisible(true)
    const info = await get('/api/get-create-build-info', {
      params: {
        appId: router.query.appId
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
    console.log(value)
    console.log(value)
    setCommitMsg(options[1]?.message || '')
    form.setFieldsValue({
      branch_commit: value
    })
  }

  async function onFinish(values) {
    const [branch, commit] = values.branch_commit
    values.branch = branch
    values.commit = commit
    Reflect.deleteProperty(values, 'branch_commit')
    console.log('----values----', values)

    // TODO: wait backend
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
    }, 2500)
  }

  return (
    <div className="page-version">
      <div className="header-container">
        <Button type="primary" onClick={addNewVersion}>
          新增版本
        </Button>
      </div>
      <Modal
        title="测试标题"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width="70%"
      >
        <SyntaxHighlighter language="bash" style={darcula}>
          {modalContent || '(num) => num + 1'}
        </SyntaxHighlighter>
      </Modal>
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
          <span>应用ID：{router.query.appId}</span>
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
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              onClick={confirm}
            >
              确定
            </Button>
          </div>
        </Form>
      </Drawer>
      <style jsx global>{`
        .page-version {
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
  // const data = await request(ctx).get('/api/get-create-build-info', {
  //   params: {
  //     appId: ctx.query.appId
  //   }
  // })
  return {}
}
