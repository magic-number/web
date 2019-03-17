import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Table from 'antd/lib/table'
import 'antd/lib/table/style/index.less'
import Summary from '../../../../component/summary'


class Home extends React.PureComponent {

  render() {
    const { match, testsuites = [], apis = [] } = this.props
    return <section className="testsuite-manager-home">
      <header>
        <Link to={`${match.url}/creator`}><Summary title="+" value="创建场景" className="primary"/></Link>
        <Summary title="接口总数" value={testsuites.length}/>
      </header>
      {this.renderTable(testsuites, apis)}
    </section>
  }

  renderTable(rows, apis) {
    const { Column } = Table
    return <Table dataSource={rows}>
      <Column
        title="场景名称"
        dataIndex="name"
        key="name"
        sorter={(a, b) => a.name > b.name }
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
        render={(text, record) => <ul>{record.apis.map(i => {
          const m = apis.filter(j => j.id === i)
          if (m.length === 1) return <li key={m[0].uri} title={m[0].remark}>{m[0].uri}</li>
        })}</ul>}
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

export default withRouter(connect(state => {
  const { testsuites = [], apis = [] } = state
  return { testsuites, apis }
})(Home))