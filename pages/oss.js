import { Button, Table, message, Upload } from 'antd'
import request from '@js/request'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CopyOutlined, UploadOutlined } from '@ant-design/icons'

const Column = Table.Column

export default function AliOSS(props) {
  function onChange(info) {
    console.log('----', info)
  }

  return (
    <div className="page-oss">
      <Upload onChange={onChange}>
        <Button>
          <UploadOutlined />
          点击上传
        </Button>
      </Upload>
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
        <Column title="创建人" dataIndex="name" />
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
