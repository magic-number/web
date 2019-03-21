import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'antd';
import Summary from '../../../component/summary';
import './home.less';

class Home extends React.PureComponent {
  renderTable(rows, apis) {
    const { Column } = Table;
    const { match } = this.props;
    return (
      <Table dataSource={rows} rowKey="id">
        <Column
          title="规则备注"
          dataIndex="remark"
          key="remark"
          sorter={(a, b) => a.remark > b.remark}
        />
        <Column
          title="对应接口"
          key="api"
          sorter={(a, b) => {
            const [A] = apis.filter(i => i.id === a);
            const [B] = apis.filter(i => i.id === b);
            return A.id > B.id;
          }}
          render={(text, record) => {
            const { api } = record;
            const [Api, ...rest] = apis.filter(i => i.id === api);
            if (Api && rest.length === 0) {
              return Api.uri;
            }
            return null;
          }}
        />
        <Column
          title="规则类型"
          key="mode"
          sorter={(a, b) => a.mode > b.mode}
          render={(text, record) => {
            const Map = {
              testcase: '测试用例',
              func: '执行函数',
            };
            return Map[record.mode];
          }}
        />
        <Column
          title="操作"
          key="operation"
          render={(text, record) => <Link className="operation-edit" to={`${match.url}/${record.id}`}>编辑</Link>}
        />
      </Table>
    );
  }

  render() {
    const { match, apiDataRules = [], apis = [] } = this.props;
    return (
      <section className="rule-home">
        <header>
          <Link to={`${match.url}/creator`}><Summary title="+" value="创建数据规则" className="primary" /></Link>
          <Summary title="数据规则" value={apiDataRules.length} />
        </header>
        {this.renderTable(apiDataRules, apis)}
      </section>
    );
  }
}

export default withRouter(connect((state) => {
  const { apiDataRules = [], apis = [] } = state;
  return { apiDataRules, apis };
})(Home));
