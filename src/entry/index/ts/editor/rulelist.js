import React from 'react';
import {
  Button, Checkbox, Form, Input, Timeline,
} from 'antd';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../../common';
import store, { ActionMap } from '../../../../service/redux';
import LoadingHOC from '../../../../component/LoadingHOC';
import './rulelist.less';

class RuleList extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      selected: null,
    };
    rpc({
      url: Rpath('apidatarule'),
    }).then((res) => {
      const { data = [], success = false } = res;
      const { setLoadStatus } = props;
      if (success) {
        store.dispatch(ActionMap.apiDataRules(data));
        return setLoadStatus();
      }
      return Promise.reject(res);
    });
  }

  renderApiLine() {
    const { formData, apiDataRules: ApiDataRules = [], apis: APIs } = this.props;
    const { apis, apiDataRules } = formData;
    const { Item } = Timeline;
    const { selected } = this.state;
    const rules = ApiDataRules.filter(item => apiDataRules.filter(i => i === item.id).length > 0);
    return (
      <Timeline>
        {apis.map((id) => {
          const [api] = APIs.filter(i => i.id === id);
          if (api) {
            const [rule] = rules.filter(i => i.api === id);
            return (
              <Item
                className={selected === api ? 'selected' : ''}
                key={id}
                dot={<Checkbox checked={!!rule} />}
                onClick={() => this.setState({ selected: api })}
              >
                {api.uri}
              </Item>
            );
          }
          return null;
        })}
      </Timeline>
    );
  }

  renderEditor() {
    const { selected } = this.state;
    if (selected === null) return null;

    return (
      <Form className="testsuite-editor-rule" onSubmit={this.onSubmit}>
        <Form.Item
          label="接口URI"
        >
          <Input value={selected.uri} disabled />
        </Form.Item>

        <Form.Item
          label="接口备注"
        >
          <Input.TextArea placeholder="接口备注信息" rows={4} value={selected.remark} disabled />

        </Form.Item>
        <footer><Button type="primary" onClick={this.onSubmit}>下一步</Button></footer>
      </Form>
    );
  }

  render() {
    return (
      <section className="rule-editor">
        {this.renderApiLine()}
        {this.renderEditor()}
      </section>
    );
  }
}

export default LoadingHOC(connect((state) => {
  const { apis, apiDataRules } = state;
  return { apis, apiDataRules };
})(RuleList));
