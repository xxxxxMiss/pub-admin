import { Form, Button, Input, message } from 'antd'
import { post } from '@js/request'

export default function Register() {
  async function onFinish(values) {
    const { name, password } = values
    const res = await post('/api/register', { name, password })
    if (res) {
      message.success('注册成功')
    }
  }
  return (
    <div className="page-register">
      <Form onFinish={onFinish} labelAlign="left">
        <Form.Item
          label="用户名"
          name="name"
          rules={[
            {
              required: true,
              message: '用户名不能为空'
            }
          ]}
        >
          <Input placeholder="请输入用户名"></Input>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '密码不能为空'
            }
          ]}
        >
          <Input.Password placeholder="请输入密码"></Input.Password>
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={['password']}
          required
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('两次输入的密码不一致')
              }
            })
          ]}
        >
          <Input.Password placeholder="请输入密码"></Input.Password>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form>
      <style jsx>{`
        .page-register {
        }
      `}</style>
    </div>
  )
}
