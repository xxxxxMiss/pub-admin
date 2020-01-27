import React, { useState } from 'react'
import { Button, Table, message, Upload } from 'antd'
import request, { post } from '@js/request'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CopyOutlined, UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const Column = Table.Column

export default function AliOSS(props) {
  const [file, setFile] = useState('')

  function onChange(info) {
    setFile(info.file)
  }

  async function upload() {
    const formData = new FormData()
    formData.append('avatar', file)
    const rst = await post('/api/put-oss', formData)
    console.log(rst)
  }

  return (
    <div className="page-oss">
      <Upload onChange={onChange} beforeUpload={() => false}>
        <Button>
          <UploadOutlined />
          选择文件
        </Button>
      </Upload>
      <Button onClick={upload}>点击上传</Button>
      <Table dataSource={props.data}>
        <Column title="文件名" dataIndex="name" />
        <Column
          title="oss地址"
          dataIndex="url"
          render={url => {
            return (
              <div>
                <span className="url">{url}</span>
                <CopyToClipboard
                  text={url}
                  onCopy={() => message.success('复制成功')}
                >
                  <CopyOutlined />
                </CopyToClipboard>
              </div>
            )
          }}
        />
        <Column
          title="创建时间"
          dataIndex="lastModified"
          render={date => {
            return dayjs(date).format('YYYY.MM.DD HH:mm:ss')
          }}
        />
      </Table>
      <style jsx>{`
        .page-oss .url {
          padding-right: 10px;
        }
      `}</style>
    </div>
  )
}

AliOSS.getInitialProps = async ctx => {
  // { res: {}, objects: [] }
  const result = await request(ctx).get('/api/get-oss-list')
  return {
    data: result?.objects || []
  }
}
