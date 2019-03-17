import React from 'react'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import 'antd/lib/form/style/index.less'
import 'antd/lib/input/style/index.less'
import 'antd/lib/button/style/index.less'

class Base extends React.PureComponent {

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
          label="场景名称"
        >
          {getFieldDecorator('name', {
            initialValue: getInitialValue('name'),
            rules: [ {
              required: true, message: '场景名称',
            }],
          })(
            <Input placeholder="场景唯一的名称标识"/>
          )}
        </Form.Item>

        <Form.Item
          label="场景备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark'),
          })(
            <Input.TextArea placeholder="场景备注信息" rows={4}/>
          )}
        </Form.Item>
        <footer><Button type="primary" onClick={this.onSubmit}>下一步</Button></footer>
    </Form>
  }
}

export default Base
