import React from 'react';
import {
  Button, Icon, Table,
} from 'antd';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../../common';
import store, { ActionMap } from '../../../../service/redux';
import FormHOC from '../../../../component/FormHOC';
import LoadingHOC from '../../../../component/LoadingHOC';
import './apilist.less';

class ApiList extends React.PureComponent {
  onSubmit = () => {
    const { selections } = this.state;
    const { onData } = this.props;
    onData(selections);
  }

  componentFetchData() {
    return rpc({
      url: Rpath('api'),
    }).then((res) => {
      const { data = [], success = false } = res;
      if (success) {
        return data;
      }
      return Promise.reject(res);
    });
  }

  componentDidFetch(APIs) {
    store.dispatch(ActionMap.apis(APIs));
    const { formData = {} } = this.props;
    const { apis = [] } = formData;
    this.setState({
      selections: apis,
    });
  }

  renderTableList() {
    const { selections = [] } = this.state;
    const { apis: APIs } = this.props;
    const { Column } = Table;
    return (
      <Table
        dataSource={APIs}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selections,
          onChange: (selectedRowKeys) => {
            this.setState({
              selections: selectedRowKeys,
            });
          },
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
          title="类型"
          dataIndex="type"
          key="type"
          sorter={(a, b) => a.type > b.type}
        />
        <Column
          title="方法"
          key="method"
          sorter={(a, b) => a.method > b.method}
          render={(text, record) => (record.method || '--')}
        />
      </Table>
    );
  }

  render() {
    const { onPre } = this.props;
    return (
      <section className="api-list">
        {this.renderTableList()}
        <Button.Group className="action" size="large">
          <Button onClick={event => onPre(event)}>
            <Icon type="left" />
上一步
          </Button>
          <Button onClick={this.onSubmit} type="primary">
            下一步
            <Icon type="right" />
          </Button>
        </Button.Group>
      </section>
    );
  }
}

export default FormHOC(connect((state) => {
  const { apis } = state;
  return { apis };
})(LoadingHOC(ApiList)));
