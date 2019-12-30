import { Drawer, Button, Form, Input, Select } from 'antd'
import { useState } from 'react'

export default function Version() {
  const [visible, setVisible] = useState(false)
  function addNewVersion() {
    setVisible(false)
  }

  return (
    <div className="page-version">
      <div className="header-container">
        <Button type="primary" onClick={() => setVisible(true)}>
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
              <Select.Option value="xx"></Select.Option>
              <Select.Option value="xx"></Select.Option>
            </Select>
            <Select placeholder="请选择要发布的commit"></Select>
          </Form.Item>
          <Form.Item label="打包工具">
            <Select></Select>
          </Form.Item>
          <div className="btn-group">
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button onClick={addNewVersion}>确定</Button>
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
