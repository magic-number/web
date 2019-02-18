import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import { ActionMap } from '../../../service/redux/action'
import 'antd/lib/form/style/index.less'
import 'antd/lib/input/style/index.less'
import 'antd/lib/button/style/index.less'
import './creator.less'


class Creator extends React.PureComponent {

  submit = e => {
    e.preventDefault()
    const { form, history, match, dispatch, apis } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)        
        rpc({
          url: Rpath('api'),
          method: 'POST',
          data: values
        }).then(res => {
          const { data } = res
          dispatch(ActionMap.apis(apis.concat(data)))
          history.push(`${match.url.replace(/creator$/, '')}${data.id}`, location.state)
        }, err => {
          console.error(err)
        })
        
      }
    })
  }

  render() {
    const { form, match, apis } = this.props
    const { getFieldDecorator } = form
    const id = match.params.id
    const candicates = apis.filter(i => i.id === id)
    const isEdit = candicates.length === 1
    const getInitialValue = (k) => {
      if (isEdit) return candicates[0][k]
      return null
    }
    return <Form className="creator" onSubmit={this.submit}>
      <header>{isEdit ? '修改API' : '增加新的API'}</header>
      <Form.Item
          label="uri"
        >
          {getFieldDecorator('id', {
            initialValue: getInitialValue('id'),
            rules: [ {
              required: true, message: '必须输入',
            }],
          })(
            <Input placeholder="rpc接口名称或者http请求" disabled={isEdit}/>
          )}
        </Form.Item>

        <Form.Item
          label="名称"
        >
          {getFieldDecorator('name', {
            initialValue: getInitialValue('name')
          })(
            <Input placeholder="为接口增加一个便于记忆的名称"/>
          )}
        </Form.Item>

        <Form.Item
          label="备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark')
          })(
            <Input placeholder="添加备注说明"/>
          )}
        </Form.Item>

        <Form.Item
          label="数据规则"
        >
          {getFieldDecorator('template', {
            initialValue: getInitialValue('template')
          })(
            <Input placeholder="返回数据的规则模板"/>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={this.submit}>{isEdit ? '更新' : '创建'}</Button>
        </Form.Item>
    </Form>
  }
}

const _creator = Form.create({})(withRouter(Creator));

export default connect(state => {
  return { apis: state.apis }
})(_creator)
