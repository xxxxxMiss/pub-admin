import { Drawer, Form, Select, Table } from 'antd'
import { useEffect, useState } from 'react'

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
      <div>this is build page</div>
      <Drawer visible={visible}>
        <Form>
          <Form.Item></Form.Item>
        </Form>
      </Drawer>
      <style jsx>{`
        .page-build {
        }
      `}</style>
    </div>
  )
}
