import React from 'react';
import {
  AutoComplete, Form, Input, InputNumber, Button, message, Select,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import FormHOC from '../../../component/FormHOC';
import store, { ActionMap } from '../../../service/redux';
import './editor.less';

class Editor extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    const { formData = {} } = props;
    const { mode = 'testcase' } = formData;
    this.state = {
      mode,
    };
  }

  onSubmit = (event) => {
    const { collectData, history, apiDataRules: rows = [] } = this.props;
    collectData(event).then((vals) => {
      rpc({
        url: Rpath('apidatarule'),
        method: 'POST',
        data: vals,
      }).then((res) => {
        const { data } = res;
        const createFlag = !vals.id && data.id;
        message.success(`${createFlag ? '创建' : '更新'}成功`);
        if (createFlag) {
          store.dispatch(ActionMap.apiDataRules(rows.concat(data)));
        } else {
          const idx = rows.findIndex(i => i.id === data.id);
          rows[idx] = data;
          store.dispatch(ActionMap.apiDataRules(rows.slice(0)));
        }
        history.goBack();
      }, res => message.error(`操作失败!${JSON.stringify(res)}`).then(() => Promise.reject(res)));
    });
  }

  render() {
    const { form, getInitialValue, history } = this.props;
    const { getFieldDecorator } = form;
    const { mode = 'testcase' } = this.state;
    return (
      <Form className="rule-editor" onSubmit={this.onSubmit}>
        {getFieldDecorator('id', {
          initialValue: getInitialValue('id'),
        })(
          <Input type="hidden" />,
        )}
        <Form.Item
          label="目标接口"
        >
          {
          getFieldDecorator('api', {
            initialValue: getInitialValue('api'),
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
          label="规则备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark'),
          })(
            <Input.TextArea placeholder="规则备注信息" rows={4} />,
          )}
        </Form.Item>

        <Form.Item
          label="优先级别"
        >
          {getFieldDecorator('priority', {
            initialValue: getInitialValue('priority') || 1,
          })(
            <InputNumber className="priority" placeholder="1～100, 值越大优先级越高" min={1} max={100} />,
          )}
        </Form.Item>

        <Form.Item
          label="规则类型"
        >
          {getFieldDecorator('mode', {
            initialValue: getInitialValue('mode') || 'testcase',
          })(
            <Select onChange={nmode => this.setState({ mode: nmode })}>
              <Select.Option value="testcase">返回测试用例</Select.Option>
              <Select.Option value="json">返回json</Select.Option>
              <Select.Option value="mockjs" disabled>Mockjs随机数据</Select.Option>
              <Select.Option value="func">执行函数</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label={(() => {
            switch (mode) {
              case 'testcase':
                return '测试用例';
              case 'json':
                return 'JSON数据';
              case 'func':
                return '函数代码';
              default:
                return '未知类型';
            }
          })()}
        >
          {
          getFieldDecorator('data', {
            initialValue: getInitialValue('data'),
          })((() => {
            switch (mode) {
              case 'testcase':
              {
                const { testcases = [] } = this.props;
                const ds = testcases.map(i => ({ value: i.id, text: `${i.name} | ${i.remark}` }));
                return (
                  <AutoComplete
                    dataSource={ds}
                    filterOption={(val, option) => option.props.children.indexOf(val) > -1}
                  />
                );
              }
              case 'json':
              case 'func':
              default:
                return <Input.TextArea rows={8} placeholder="JSON数据" className="json" />;
            }
          })())
        }
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

export default withRouter(connect((state) => {
  const { apis, testcases, apiDataRules } = state;
  return { apis, testcases, apiDataRules };
})(FormHOC(Editor)));
