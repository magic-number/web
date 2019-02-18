import React from 'react'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import Table from 'antd/lib/table'
import LeftPanel from '../leftpanel'
import Manager from './manager'
import 'antd/lib/card/style/index.less'
import 'antd/lib/table/style/index.less'
import 'antd/lib/pagination/style/index.less'

import './index.less'

class TestcaseHome extends React.PureComponent {
  render() {
    // const { match } = this.props
    const columns = [
      {
        title: '接口名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用例数量',
        dataIndex: 'count',
        key: 'count',
        render: val => <span style={{ color: val > 0 ? '#000' : 'red' }}>{val}</span>
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return <span>添加测试用例</span>
        }
      }
    ]
    const data = [
      { name: 'pageInfo', count: 0 },
      { name: 'someAPI', count: 10 },
    ]
    return <section className="api-manager-home">
      <Table columns={columns} dataSource={data}/>
    </section>
  }
}

const _TestcaseHome = withRouter(TestcaseHome)

export default function Testcase ({ match }) {
  const renderItem = api => <Link to={`${match.url}/${api.id}`}>{api.id}</Link>
  return <section className="api-manager">
          <LeftPanel renderItem={renderItem}/>
          <Switch>
            <Route exact path={match.url} component={_TestcaseHome} />
            <Route exact path={`${match.url}/:api`} component={Manager} />
          </Switch>
        </section>
}