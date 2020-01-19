import { Form, Button, Input, message } from 'antd'
import { post } from '@js/request'
import { userJoiSchema } from '@js/validation'

export default function Register() {
  async function onFinish(values) {
    const { error } = userJoiSchema.validate(values)
    if (error) {
      message.error(error.message)
      return
    }
    const { name, password, repeat_password } = values
    const res = await post('/api/register', { name, password, repeat_password })
    if (res) {
      message.success('注册成功')
    }
  }
  return (
    <div className="page-register">
      <Form onFinish={onFinish} labelAlign="left">
        <Form.Item label="用户名" name="name">
          <Input placeholder="请输入用户名"></Input>
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input.Password placeholder="请输入密码"></Input.Password>
        </Form.Item>
        <Form.Item label="确认密码" name="repeat_password">
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
