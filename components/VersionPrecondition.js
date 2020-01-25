import { Button, Popover } from 'antd'
import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export default function VersionPrecondition(props) {
  return (
    <div className="version-precondition">
      <h3 className="block-title">
        <UnorderedListOutlined />
        版本创建信息
      </h3>
      <ul className="item-container">
        <li>
          <span className="label">创建时间</span>
          <span className="text">
            {dayjs(props.createAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          <Popover
            overlayClassName="download-zip"
            trigger="hover"
            content={
              <div className="btn-group">
                {props.downloadUrl.map((url, index) => (
                  <Button type="link" href={url} key={url} download>
                    {index === 0 ? 'FAT' : index === 1 ? 'UAT' : 'PRO'}
                  </Button>
                ))}
              </div>
            }
            title="下载zip包"
          >
            <DownloadOutlined />
          </Popover>
        </li>
        <li>
          <span className="label">分支</span>
          <span className="text">{props.branch}</span>
        </li>
        <li>
          <span className="label">Git详情</span>
          <span className="text">{props.gitUrl}</span>
        </li>
        <li>
          <span className="label">Node版本</span>
          <span className="text">{props.nodeVersion}</span>
        </li>
        <li>
          <span className="label">打包工具</span>
          <span className="text">{props.buildTool}</span>
        </li>
        <style jsx global>{`
          .version-precondition {
            font-size: 14px;
          }
          .version-precondition .anticon {
            padding-right: 15px;
          }
          .version-precondition .block-title {
            background-color: #eee;
            color: #999;
            margin-bottom: 10px;
            padding: 10px 6px;
          }
          .version-precondition .item-container {
            padding: 15px 10px;
            border-radius: 6px;
            border: 1px solid #f0f0f0;
          }
          .version-precondition .item-container:hover {
            transition: box-shadow 0.2s linear;
            box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
              0 3px 6px 0 rgba(0, 0, 0, 0.12),
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
          }
          .version-precondition li {
            padding: 5px;
          }
          .version-precondition .label {
            font-size: 14px;
            padding-right: 10px;
          }
          .version-precondition .text {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
          }
          .download-zip .btn-group .ant-btn + .ant-btn {
            margin-left: 10px;
          }
        `}</style>
      </ul>
    </div>
  )
}
