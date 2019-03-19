import React from 'react'
import { Form, Input, Button } from 'antd'
import FormHOC from '../../../component/FormHOC'

class Editor extends React.PureComponent {

  onSubmit = (event) => {
    const { collectData, onData } = this.props
    collectData(event).then((vals) => onData(vals))
  }

  render() {
    const { form, getInitialValue } = this.props
    const { getFieldDecorator } = form
    return <Form className="testsuite-editor-base" onSubmit={this.onSubmit}>
        {getFieldDecorator('id', {
            initialValue: getInitialValue('id'),
          })(
            <Input type="hidden"/>
          )}
        <Form.Item
          label="用例名称"
        >
          {getFieldDecorator('name', {
            initialValue: getInitialValue('name'),
            rules: [ {
              required: true, message: '用例必须有一个名称',
            }],
          })(
            <Input placeholder="测试用例名称"/>
          )}
        </Form.Item>

        <Form.Item
          label="用例备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark'),
          })(
            <Input.TextArea placeholder="用例备注信息" rows={4}/>
          )}
        </Form.Item>

        <Form.Item
          label="用例数据"
        >
          {getFieldDecorator('data', {
            initialValue: JSON.stringify(getInitialValue('data')),
          })(
            <Input.TextArea rows={4} placeholder="JSON数据" />
          )}
        </Form.Item>
        <footer><Button type="primary" onClick={this.onSubmit}>完成</Button></footer>
    </Form>
  }
}

export default FormHOC(Editor)
