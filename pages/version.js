import { Button, Drawer, Form, Input, Select } from 'antd'
import { useState } from 'react'
import { useRouter } from 'next/router'
import request, { get } from '@js/request'

export default function Version(props) {
  const router = useRouter()
  const [visible, setVisible] = useState(false)
  const [buildInfo, setBuildInfo] = useState([])

  async function addNewVersion() {
    setVisible(true)
    const info = await get('/api/get-create-build-info', {
      params: {
        appId: router.query.appId
      }
    })
    setBuildInfo(info)
  }

  function confirm() {
    setVisible(false)
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
        width={500}
        onClose={() => setVisible(false)}
      >
        <div className="drawer-header">
          <h3 className="title">新增版本</h3>
          <span>应用的名称：{'xx'}</span>
          <span>应用的类型：{'xx'}</span>
        </div>
        <Form>
          <Form.Item label="版本号">
            <Input defaultValue={Date.now()} />
          </Form.Item>
          <Form.Item label="版本名称" required>
            <Input />
          </Form.Item>
          <Form.Item label="Node版本" required>
            <Input />
          </Form.Item>
          <Form.Item label="备注">
            <Input />
          </Form.Item>
          <Form.Item label="Commit">
            <Select placeholder="请选择要发布的分支">
              {buildInfo.map(item => (
                <Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
            <Select placeholder="请选择要发布的commit"></Select>
          </Form.Item>
          <Form.Item label="打包工具">
            <Select></Select>
          </Form.Item>
          <div className="btn-group">
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button onClick={confirm}>确定</Button>
          </div>
        </Form>
      </Drawer>
      <style jsx>{`
        .page-version {
        }
        .page-version .drawer-container .title {
          font-size: 18px;
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
