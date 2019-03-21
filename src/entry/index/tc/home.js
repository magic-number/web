import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { JSONViewer } from 'react-json-editor-viewer';
import Summary from '../../../component/summary';
import './home.less';

class Home extends React.PureComponent {
  renderTable(rows) {
    const { Column } = Table;
    const { match } = this.props;
    return (
      <Table dataSource={rows} rowKey="id">
        <Column
          title="用例名称"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name > b.name}
        />
        <Column
          title="规则备注"
          dataIndex="remark"
          key="remark"
          sorter={(a, b) => a.remark > b.remark}
        />

        <Column
          title="用例数据"
          key="data"
          render={(text, record) => <JSONViewer data={record.data} collapsible />}
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
    const { match, testcases = [] } = this.props;
    return (
      <section className="tc-home">
        <header>
          <Link to={`${match.url}/creator`}><Summary title="+" value="创建测试用例" className="primary" /></Link>
          <Summary title="测试用例" value={testcases.length} />
        </header>
        {this.renderTable(testcases)}
      </section>
    );
  }
}

export default withRouter(connect((state) => {
  const { testcases } = state;
  return { testcases };
})(Home));
