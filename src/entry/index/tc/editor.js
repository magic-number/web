import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { withRouter } from 'react-router-dom'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import FormHOC from '../../../component/FormHOC'
import store, { ActionMap } from '../../../service/redux'
import './editor.less'

class Editor extends React.PureComponent {

  onSubmit = (event) => {
    const { collectData, history } = this.props
    collectData(event).then((vals) => {
      vals.data = JSON.parse(vals.data)
      rpc({
        url: Rpath('testcase'),
        method: 'POST',
        data: vals,
      }).then(res => {
        message.success("创建成功")
        const { testcases = [] } = store.getState()
        const { data } = res
        store.dispatch(ActionMap.testcases(testcases.concat(data)))
        history.goBack()
      }, res => {
        return message.error(`创建失败!${JSON.stringify(res)}`).then(() => Promise.reject(res))
      })
    })
  }

  render() {
    const { form, getInitialValue, history } = this.props
    const { getFieldDecorator } = form
    return <Form className="tc-editor" onSubmit={this.onSubmit}>
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
            <Input.TextArea rows={8} placeholder="JSON数据" className="json"/>
          )}
        </Form.Item>
        <footer><Button.Group><Button onClick={() => history.goBack()}>返回</Button><Button type="primary" onClick={this.onSubmit}>完成</Button></Button.Group></footer>
    </Form>
  }
}

export default withRouter(FormHOC(Editor))
