import { Drawer, Form, Select, Table, Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import request from '@js/request'

const columns = [
  {
    title: '应用名称',
    dataIndex: 'appName',
    sorter: true,
    width: '20%'
  },
  {
    title: 'Git地址',
    dataIndex: 'appGitAddr'
  },
  {
    title: '应用语言',
    dataIndex: 'appLanguage',
    width: '20%'
  }
]

export default function Build() {
  const [visible, setVisible] = useState(false)
  return (
    // <Table
    //     columns={columns}
    //     rowKey={record => record._id}
    //     dataSource={data}
    //     pagination={pagination}
    //     // loading={this.state.loading}
    //     onChange={handleTableChange}
    //   />
    <div className="page-build">
      <div>
        <Button type="primary" onClick={() => setVisible(true)}>
          新增版本
        </Button>
      </div>
      <Drawer
        visible={visible}
        width={420}
        title="新增版本"
        onClose={() => setVisible(false)}
      >
        <Form>
          <Form.Item label="版本号" name="version">
            <Input disabled value={Date.now()} />
          </Form.Item>
          <Form.Item label="版本名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Node版本" name="nodeVersion">
            <Select defaultValue="9.0">
              <Select.Option value="9.0">9.0</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
      <style jsx>{`
        .page-build {
        }
      `}</style>
    </div>
  )
}
