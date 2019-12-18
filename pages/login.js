import { Form, Icon, Input, Button, Checkbox } from 'antd'
import axios from 'axios'

function NormalLoginForm(props) {
  function handleSubmit(e) {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        axios.get('/api/login', { params: values }).then(res => {
          console.log('---res---', res)
        })
      }
    })
  }

  const { getFieldDecorator } = props.form
  return (
    <div className="page-login">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
      <style jsx global>{`
        .page-login {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .login-form {
          color: red;
        }
      `}</style>
    </div>
  )
}

const Login = Form.create({ name: 'normal_login' })(NormalLoginForm)
export default Login
