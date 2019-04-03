import React from 'react';
import { connect } from 'react-redux';
import {
  message, Select, Table, Button,
} from 'antd';
import JSONTree from 'react-json-tree';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import LoadingHOC from '../../../component/LoadingHOC';
import './sessionView.less';

class SessionView extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      sending: false,
      loading: false,
    };
  }

  setTestSuite = (testsuite) => {
    this.setState({
      sending: true,
    });
    const { data = {} } = this.props;
    const { id: sessionId } = data;
    rpc({
      url: Rpath('testsuite'),
      method: 'POST',
      data: {
        sessionId,
        testsuite,
      },
    }).then((res) => {
      const { data: rdata = {} } = res;
      const { name } = rdata;
      message.info(`会话${sessionId}切换场景为${name}`);
      this.setState({
        sending: false,
      });
    });
  }

  fetchRequest = () => {
    this.setState({
      loading: true,
    }, () => {
      this.componentFetchData().then((converstaions) => {
        this.componentDidFetch(converstaions);
        this.setState({
          loading: false,
        });
      });
    });
  }

  componentFetchData() {
    const { data = {} } = this.props;
    const { id: sessionId } = data;
    return rpc({
      url: Rpath('conversation'),
      data: {
        sessionId,
      },
    }).then(({ data: ndata }) => ndata);
  }

  componentDidFetch(converstaions = []) {
    this.setState({
      converstaions,
    });
  }

  renderTable() {
    const { converstaions = [], loading } = this.state;
    const { Column } = Table;
    return (
      <Table dataSource={converstaions} pagination={{ position: 'both' }} loading={loading}>
        <Column
          title="URI"
          key="uri"
          sorter={(a, b) => a.request.uri > b.request.uri}
          render={(text, record) => {
            const { request } = record;
            const { uri } = request;
            return uri;
          }}
        />
        <Column
          title="请求参数"
          key="params"
          render={(text, record) => {
            const { request } = record;
            const { body } = request;
            return <JSONTree data={body} shouldExpandNode={() => false} />;
          }}
        />
        <Column
          title="返回结果"
          key="response"
          render={(text, record) => {
            const { response } = record;
            return <JSONTree data={response} shouldExpandNode={() => false} />;
          }}
        />
        <Column
          title="归属场景"
          key="testsuite"
          render={(text, record) => {
            const { testSuiteName } = record;
            return testSuiteName;
          }}
        />
        <Column
          title="应用规则"
          key="rule"
          render={(text, record) => {
            const { rule } = record;
            return rule.remark;
          }}
        />
      </Table>
    );
  }

  render() {
    const { data = {}, testsuites = [], key } = this.props;
    const { testSuite = {} } = data;
    const { name: testSuiteName } = testSuite || {};
    const { sending = false } = this.state;
    return (
      <section className="sessionView" key={key}>
        <header>
          <div>
            <div>会话id</div>
            <div>{data.id}</div>
          </div>
          <div>
            <div>客户端</div>
            <div>{data.userAgent}</div>
          </div>
          <div>
            <div>当前场景</div>
            <Select
              disabled={sending}
              defaultValue={testSuiteName}
              className="testsuite-picker"
              showSearch
              onChange={this.setTestSuite}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {testsuites.map(({ id, name }) => <Select.Option key={id} value={name}>{name}</Select.Option>)}
            </Select>
          </div>
          <div>
            <Button onClick={this.fetchRequest}>刷新</Button>
          </div>
        </header>
        {this.renderTable()}
      </section>
    );
  }
}

export default connect(({ testsuites }) => ({ testsuites }))(LoadingHOC(SessionView));
