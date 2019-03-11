import React from 'react'
import Table from 'antd/lib/table'
import 'antd/lib/table/style/index.less'
import Summary from '../../../component/summary'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Creator from './creator'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import './index.less'

class ApiHome extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)
  }

  render() {
    const { match, apis = [] } = this.props
    const rpcs = apis.filter(i => i.type === 'rpc')
    const https = apis.filter(i => i.type === 'http')
    return <section className="api-manager-home">
      <header>
        <Link to={`${match.url}/creator`}><Summary title="+" value="创建接口" className="primary"/></Link>
        <Summary title="接口总数" value={apis.length}/>
        <Summary title="RPC接口总数" value={rpcs.length}/>
        <Summary title="Http接口总数" value={https.length}/>
      </header>
      {this.renderApiTable(apis)}
    </section>
  }

  renderApiTable(apis) {
    const { Column } = Table
    return <Table dataSource={apis}>
      <Column
        title="URI"
        dataIndex="uri"
        key="uri"
        sorter={(a, b) => a.uri > b.uri }
      />
      <Column
        title="接口备注"
        dataIndex="remark"
        key="remark"
        sorter={(a, b) => a.remark > b.remark}
      />
      <Column
        title="接口类型"
        dataIndex="type"
        key="type"
        sorter={(a, b) => a.type > b.type}
      />
      <Column
        title="请求方法"
        dataIndex="method"
        key="method"
        sorter={(a, b) => a.method > b.method}
      />
      <Column
        title="操作"
        key="operation"
        render={(text, record) => {
          return <div>编辑|删除</div>
        }}
      />
    </Table>
  }
}

const _ApiHome = withRouter(connect(state => {
  const { apis = [] } = state
  return { apis }
})(ApiHome))


export default function({ match }) {
  rpc({
    url: Rpath('api')
  }).then(res => {
    const { data = [], success = false } = res
    if (success) {
      store.dispatch(ActionMap.apis(data))
    }
  })
  return <Switch className="api-manager">
            <Route exact path={match.url} component={_ApiHome} />
            <Route exact path={`${match.url}/creator`} component={Creator} />
        </Switch>
}
