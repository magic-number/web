import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'antd';
import Summary from '../../../component/summary';
import './home.less';

class Home extends React.PureComponent {
  renderTable(data) {
    const { Column } = Table;
    const { match } = this.props;
    return (
      <Table dataSource={data} rowKey="id">
        <Column
          title="URI"
          dataIndex="uri"
          key="uri"
          sorter={(a, b) => a.uri > b.uri}
        />
        <Column
          title="类型"
          dataIndex="type"
          key="type"
          sorter={(a, b) => a.type > b.type}
        />
        <Column
          title="方法"
          key="method"
          sorter={(a, b) => a.method > b.method}
          render={(text, record) => {
            switch (record) {
              case 'http':
                return record.method;
              default:
                return '--';
            }
          }}
        />
        <Column
          title="备注"
          dataIndex="remark"
          key="remark"
          sorter={(a, b) => a.remark > b.remark}
        />
        <Column
          title="操作"
          key="operation"
          render={(text, record) => (
            <React.Fragment>
              <Link className="operation operation-edit" to={`${match.url}/${record.id}`}>编辑</Link>
              <Link className="operation operation-relation" to={`${match.url}/${record.id}/relation`}>数据关系</Link>
              <NavLink className="operation operation-tc" to={`/tc/creator/${record.id}`}>创建测试用例</NavLink>
            </React.Fragment>
          )}
        />
      </Table>
    );
  }

  render() {
    const { match, apis = [] } = this.props;
    return (
      <section className="api-home">
        <header>
          <Link to={`${match.url}/creator`}><Summary title="+" value="创建接口" className="primary" /></Link>
          <Summary title="接口总数" value={apis.length} />
        </header>
        {this.renderTable(apis)}
      </section>
    );
  }
}

export default withRouter(connect((state) => {
  const { apiDataRules = [], apis = [] } = state;
  return { apiDataRules, apis };
})(Home));
