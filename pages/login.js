import { Form, Icon, Input, Button, Checkbox, notification } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'

function NormalLoginForm(props) {
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        axios.get('/api/login', { params: values }).then(res => {
          const { code, message } = res.data
          if (code != 0) {
            return notification.open({
              message: '登录提醒',
              description: message
            })
          }
          router.replace('/index')
        })
      }
    })
  }

  const { getFieldDecorator } = props.form
  return (
    <div className="page-login">
      <Form labelAlign="left" onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>记住我</Checkbox>)}
          {/* <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
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

const Login = Form.create({ name: 'normal_login' })(NormalLoginForm)
export default Login
