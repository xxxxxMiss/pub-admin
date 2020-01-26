import React, { useState, useEffect } from 'react'
import {
  LoadingOutlined,
  CheckCircleTwoTone,
  OrderedListOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { Tag, Switch, Button } from 'antd'
import { post, get } from '@js/request'
import dynamic from 'next/dynamic'

const HighlightNoSSR = dynamic(() => import('@components/Highlight'), {
  ssr: false
})

export default function VersionBuildStage(props) {
  const [isAborted, setIsAborted] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState('')

  useEffect(() => {
    setIsAborted((props.status || []).includes('aborted'))
  })

  async function abortBuild() {
    if (!isAborted) {
      const rst = await post('/api/abort-build')
      rst && setIsAborted(true)
    }
  }

  async function viewLog() {
    setModalVisible(true)
    const log = await get('/api/get-build-log', {
      params: {
        version: props.version
      }
    })
    setModalContent(log)
  }

  return (
    <div className="version-build-stage">
      <HighlightNoSSR
        modalVisible={modalVisible}
        modalContent={modalContent}
        setModalVisible={setModalVisible}
      />
      <div className="block-title">
        <OrderedListOutlined />
        版本状态/发布步骤
      </div>
      <ul className="item-container">
        <li className="item">
          <h3 className="title">
            <span>
              <CheckCircleTwoTone />
              版本编译
            </span>
            <span>
              <Button
                type="primary"
                disabled={isAborted}
                size="small"
                danger
                onClick={abortBuild}
              >
                终止编译
              </Button>
              <span className="gutter">查看编译日志</span>
              <FileTextOutlined onClick={viewLog} />
            </span>
          </h3>
          <div className="item-content"></div>
        </li>
        <li className="item">
          <h3 className="title">FAT</h3>
          <div className="item-content">
            <Tag color="success">{props.publishStatus}</Tag>
            <span>
              {props.publisher.name}
              {props.publishDate}
            </span>
          </div>
        </li>
        <li className="item">
          <h3 className="title">
            UAT
            <span>
              UAT准入审核
              <Switch />
            </span>
          </h3>
          <div className="item-content">
            <Tag color="success">{props.publishStatus}</Tag>
            <span>
              {props.publisher.name}
              {props.publishDate}
            </span>
          </div>
        </li>
      </ul>
      <style jsx global>{`
        .version-build-stage {
          font-size: 14px;
        }
        .version-build-stage .gutter {
          padding: 0 10px;
        }
        .version-build-stage .item {
          padding: 10px 0;
        }
        .version-build-stage .title {
          display: flex;
          justify-content: space-between;
          align-content: center;
        }
        .version-build-stage .anticon {
          padding-right: 12px;
        }
        .version-build-stage .block-title {
          background-color: #eee;
          padding: 10px 6px;
          margin-top: 18px;
          margin-bottom: 10px;
        }
        .version-build-stage .item-container {
          padding: 15px 10px;
          border-radius: 6px;
          border: 1px solid #f0f0f0;
        }
        .version-build-stage .item-container:hover {
          transition: box-shadow 0.2s linear;
          box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
            0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
        }
        .version-build-stage .item-content {
          padding-left: 30px;
        }
      `}</style>
    </div>
  )
}
