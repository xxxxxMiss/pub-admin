import { Drawer, Button, Form, Input } from 'antd'
export default function Version() {
  return (
    <div className="page-version">
      <div className="header-container">
        <Button type="primary">????</Button>
      </div>
      <Drawer>
        <Form></Form>
      </Drawer>
      <style jsx>{`
        .page-version {
        }
      `}</style>
    </div>
  )
}
//
