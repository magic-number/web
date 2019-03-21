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
          title="场景名称"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name > b.name}
        />
        <Column
          title="场景备注"
          dataIndex="remark"
          key="remark"
          sorter={(a, b) => a.remark > b.remark}
        />
        <Column
          title="接口列表"
          key="apis"
          render={(text, record) => (
            <ul>
              {record.apis.map((i) => {
                const [m] = apis.filter(j => j.id === i);
                if (m) return <li key={m.uri} title={m.remark}>{m.uri}</li>;
                return null;
              })}
            </ul>
          )}
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
    const { match, testsuites = [], apis = [] } = this.props;
    return (
      <section className="ts-home">
        <header>
          <Link to={`${match.url}/creator`}><Summary title="+" value="创建场景" className="primary" /></Link>
          <Summary title="接口总数" value={testsuites.length} />
        </header>
        {this.renderTable(testsuites, apis)}
      </section>
    );
  }
}

export default withRouter(connect((state) => {
  const { testsuites = [], apis = [] } = state;
  return { testsuites, apis };
})(Home));
