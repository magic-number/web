import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Table } from 'antd';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import Summary from '../../../component/summary';
import store, { ActionMap } from '../../../service/redux';
import { clone } from '../../../util';
import './home.less';

class Home extends React.PureComponent {
  renderTable(rows, apis) {
    const { Column } = Table;
    const { match, history, testsuites } = this.props;
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
          render={(text, record) => (
            <Button.Group>
              <Button className="operation operation-edit">
                <Link to={`${match.url}/${record.id}`}>编辑</Link>
              </Button>
              <Button
                className="operation operation-copy"
                onClick={() => {
                  const nrecord = clone(record);
                  nrecord.id = null;
                  nrecord.name = `复制${nrecord.name}`;
                  rpc({
                    url: Rpath('testsuites'),
                    method: 'POST',
                    data: nrecord,
                  }).then(({ data }) => {
                    store.dispatch(ActionMap.testsuites(testsuites.concat(data)));
                    history.push(`/ts/${data.id}`);
                  });
                }}
              >
              复制
              </Button>
            </Button.Group>
          )}
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
          <Summary title="场景总数" value={testsuites.length} />
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
