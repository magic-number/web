import React from 'react';
import {
  AutoComplete, Button, Checkbox, Form, Input, message,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import FormHOC from '../../../component/FormHOC';
import store, { ActionMap } from '../../../service/redux';
import './editor.less';

class Editor extends React.PureComponent {
  onSubmit = (event) => {
    const { collectData, history } = this.props;
    collectData(event).then((vals) => {
      try {
        vals.data = JSON.parse(vals.data);
      } catch (e) {
        message.error(`JSON数据有误，请核对！\n${e.message}`);
        return;
      }
      rpc({
        url: Rpath('testcase'),
        method: 'POST',
        data: vals,
      }).then((res) => {
        const { data } = res;
        const createFlag = !vals.id && data.id;
        message.success(`${createFlag ? '创建' : '更新'}成功`);
        const { testcases: rows = [] } = store.getState();
        if (createFlag) {
          store.dispatch(ActionMap.testcases(rows.concat(data)));
        } else {
          const idx = rows.findIndex(i => i.id === data.id);
          rows[idx] = data;
          store.dispatch(ActionMap.testcases(rows.slice(0)));
        }
        history.goBack();
      }, res => message.error(`创建失败!${JSON.stringify(res)}`).then(() => Promise.reject(res)));
    });
  }

  render() {
    const {
      form, getInitialValue, history, formData, match,
    } = this.props;
    const { params } = match;
    const { getFieldDecorator } = form;
    return (
      <Form className="tc-editor" onSubmit={this.onSubmit}>
        {getFieldDecorator('id', {
          initialValue: getInitialValue('id'),
        })(
          <Input type="hidden" />,
        )}
        <Form.Item
          label="用例名称"
        >
          {getFieldDecorator('name', {
            initialValue: getInitialValue('name'),
            rules: [{
              required: true, message: '用例必须有一个名称',
            }],
          })(
            <Input placeholder="测试用例名称" />,
          )}
        </Form.Item>

        <Form.Item
          label="关联接口"
        >
          {
          getFieldDecorator('api', {
            initialValue: params.api || getInitialValue('api'),
            rules: [{
              required: true, message: '必须关联一个API',
            }],
          })((() => {
            const { apis = [] } = this.props;
            const ds = apis.map(i => ({ value: i.id, text: `${i.uri}\t${i.remark}` }));
            return (
              <AutoComplete
                dataSource={ds}
                filterOption={(val, option) => option.props.children.indexOf(val) > -1}
              />
            );
          })())
        }
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
          label="用例数据"
        >
          {getFieldDecorator('data', {
            initialValue: JSON.stringify(getInitialValue('data')),
          })(
            <Input.TextArea rows={8} placeholder="JSON数据" className="json" />,
          )}
        </Form.Item>

        {!formData && (
        <Form.Item label="自动创建数据规则">
          {getFieldDecorator('createRule', {
            initialValue: true,
            valuePropName: 'checked',
          })(
            <Checkbox />,
          )}
        </Form.Item>
        )}
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

export default withRouter(connect(({ apis }) => ({ apis }))(FormHOC(Editor)));
