import React from 'react';
import {
  Form, Input, Button, message, Select,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import FormHOC from '../../../component/FormHOC';
import store, { ActionMap } from '../../../service/redux';
import './editor.less';

class Editor extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      type: 'rpc',
    };
  }

  onSubmit = (event) => {
    const { collectData, history } = this.props;
    /**
     * todo: api本地查重校验
     */
    collectData(event).then((vals) => {
      // rpc不需要method信息
      if (vals.type === 'rpc') {
        // eslint-disable-next-line no-param-reassign
        vals.method = '';
      }
      rpc({
        url: Rpath('api'),
        method: 'POST',
        data: vals,
      }).then((res) => {
        const { data } = res;
        const createFlag = !vals.id && data.id;
        message.success(`${createFlag ? '创建' : '更新'}成功`);
        const { apis: rows = [] } = store.getState();
        if (createFlag) {
          store.dispatch(ActionMap.apis(rows.concat(data)));
        } else {
          const idx = rows.findIndex(i => i.id === data.id);
          rows[idx] = data;
          store.dispatch(ActionMap.apis(rows.slice(0)));
        }
        history.goBack();
      }, res => message.error(`操作失败!${JSON.stringify(res)}`).then(() => Promise.reject(res)));
    });
  }

  render() {
    const { form, getInitialValue, history } = this.props;
    const { type } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className="api-editor" onSubmit={this.onSubmit}>
        {getFieldDecorator('id', {
          initialValue: getInitialValue('id'),
        })(
          <Input type="hidden" />,
        )}
        <Form.Item
          label="接口URI"
        >
          {getFieldDecorator('uri', {
            initialValue: getInitialValue('uri'),
            rules: [{
              required: true, message: '必须包含URI',
            }],
          })(
            <Input placeholder="请输入接口的URI" />,
          )}
        </Form.Item>

        <Form.Item
          label="用例备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark'),
          })(
            <Input.TextArea placeholder="用例备注信息" rows={4} />,
          )}
        </Form.Item>

        <Form.Item
          label="用例类型"
        >
          {getFieldDecorator('type', {
            initialValue: getInitialValue('type') || 'rpc',
          })(
            <Select onChange={val => this.setState({ type: val })}>
              <Select.Option value="rpc">RPC</Select.Option>
              <Select.Option value="http">Http</Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item
          label="请求方法"
        >
          {getFieldDecorator('method', {
            initialValue: getInitialValue('method') || 'GET',
          })(
            <Select disabled={type !== 'http'}>
              <Select.Option value="get">GET</Select.Option>
              <Select.Option value="post">POST</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <footer>
          <Button.Group>
            <Button onClick={() => history.goBack()}>返回</Button>
            <Button type="primary" onClick={this.onSubmit}>完成</Button>
          </Button.Group>
        </footer>
      </Form>
    );
  }
}

export default withRouter(FormHOC(Editor));
