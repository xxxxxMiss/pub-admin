import {
  Button,
  Row,
  Col,
  Drawer,
  Form,
  Input,
  Select,
  Cascader,
  message
} from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import request, { get, post } from '@js/request'
import dayjs from 'dayjs'

export default function Version(props) {
  const router = useRouter()
  const [form] = Form.useForm()

  const [visible, setVisible] = useState(false)
  const [buildInfo, setBuildInfo] = useState([])

  async function addNewVersion() {
    setVisible(true)
    const info = await get('/api/get-create-build-info', {
      params: {
        appId: router.query.appId
      }
    })
    setBuildInfo(info || [])
  }

  function confirm() {
    setVisible(false)
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
    return

    // TODO: wait backend
    const res = await post('/api/new-version', values)
    if (res) {
      message.success('新增版本成功')
    }
  }

  return (
    <div className="page-version">
      <div className="header-container">
        <Button type="primary" onClick={addNewVersion}>
          新增版本
        </Button>
      </div>
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
            version: dayjs().format('YYYYMMDDdddHHmmssa')
          }}
          onFinish={onFinish}
          {...formLayout}
          labelAlign="left"
        >
          <Form.Item label="版本号" name="version">
            <Input disabled />
          </Form.Item>
          <Form.Item label="版本名称" name="name" required>
            <Input />
          </Form.Item>
          <Form.Item label="Node版本" name="nodeVersion" required>
            <Input />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input />
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
