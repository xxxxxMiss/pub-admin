import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { get } from '@js/request'
import { useRouter } from 'next/router'

export default function Login(props) {
  const router = useRouter()

  function onFinish(values) {
    get('/api/login', { params: values }).then(res => {
      if (res) {
        router.replace('/application')
      }
    })
  }

  return (
    <div className="page-login">
      <Form labelAlign="left" onFinish={onFinish} className="login-form">
        <Form.Item name="name" required>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" required>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
          ></Input.Password>
        </Form.Item>
        <Form.Item valuePropName="checked">
          <Checkbox>记住我</Checkbox>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <style jsx global>{`
        .page-login {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
