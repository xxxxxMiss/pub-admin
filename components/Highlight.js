import SyntaxHighlighter from 'react-syntax-highlighter'
// import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Modal } from 'antd'

export default function Hightlight(props) {
  const { modalVisible, setModalVisible, modalContent } = props
  return (
    <Modal
      title="测试标题"
      visible={modalVisible}
      footer={null}
      onCancel={() => setModalVisible(false)}
      width="80%"
    >
      <SyntaxHighlighter language="shellsession">
        {modalContent || '(num) => num + 1'}
      </SyntaxHighlighter>
    </Modal>
  )
}
