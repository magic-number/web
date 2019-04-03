import React from 'react';
import {
  Button, Icon, Select, Table,
} from 'antd';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../../common';
import store, { ActionMap } from '../../../../service/redux';
import LoadingHOC from '../../../../component/LoadingHOC';
import { clone } from '../../../../util';
import './rulelist.less';

class RuleList extends React.PureComponent {
  onSubmit = () => {
    const { state } = this;
    const { dataSource = [] } = state;
    const { onData } = this.props;
    const rules = dataSource.map(i => i.ruleId);
    return onData(rules);
  }

  componentFetchData() {
    return rpc({
      url: Rpath('apidatarule'),
    }).then(({ data }) => data);
  }

  componentDidFetch(rules) {
    store.dispatch(ActionMap.apiDataRules(rules));

    const { formData, apiDataRules: ApiDataRules = [], apis: APIs } = this.props;
    const { apiDataRules, apis } = formData;
    const arules = ApiDataRules.filter(item => apiDataRules.indexOf(item.id) > -1);
    const dataSource = APIs.filter(item => apis.indexOf(item.id) > -1);

    dataSource.forEach((item) => {
      const rule = arules.find(r => r.api === item.id);
      if (rule) {
        // eslint-disable-next-line no-param-reassign
        item.ruleId = rule.id;
      }
    });
    this.setState({
      dataSource,
      // selections: dataSource.filter(i => i.rule).map(i => i.id),
    });
  }

  renderTable() {
    const { state } = this;
    const { apiDataRules: ApiDataRules = [] } = this.props;
    const { dataSource } = state;
    const { Column } = Table;
    return (
      <Table
        dataSource={dataSource}
        rowKey="id"
        rowSelection={{
          hideDefaultSelections: true,
          getCheckboxProps: record => ({ checked: !!record.ruleId }),
        }}
      >
        <Column
          title="URI"
          dataIndex="uri"
          key="uri"
          sorter={(a, b) => a.uri > b.uri}
        />
        <Column
          title="备注"
          dataIndex="remark"
          key="remark"
          sorter={(a, b) => a.remark > b.remark}
        />
        <Column
          title="数据规则"
          key="datarule"
          render={(text, record) => (
            <Select
              showSearch
              placeholder="输入规则备注进行过滤"
              defaultValue={record.ruleId}
              onChange={(rid) => {
                // eslint-disable-next-line no-param-reassign
                record.ruleId = rid;
                this.setState({
                  dataSource: clone(dataSource),
                });
              }}
            >
              {
              ApiDataRules.filter(i => i.api === record.id)
                .map(r => (<Select.Option key={r.id} value={r.id}>{r.remark}</Select.Option>))
            }
            </Select>
          )
          }
        />
      </Table>
    );
  }

  render() {
    const { onPre } = this.props;
    return (
      <section className="rulelist-editor">
        {this.renderTable()}
        <footer>
          <Button.Group className="action" size="large">
            <Button onClick={event => onPre(event)}>
              <Icon type="left" />
  上一步
            </Button>
            <Button onClick={this.onSubmit} type="primary">
              完 成
              <Icon type="right" />
            </Button>
          </Button.Group>
        </footer>
      </section>
    );
  }
}

export default connect((state) => {
  const { apis, apiDataRules } = state;
  return { apis, apiDataRules };
})(LoadingHOC(RuleList));
