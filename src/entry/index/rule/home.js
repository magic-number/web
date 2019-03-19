import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table } from 'antd'
import Summary from '../../../component/summary'


class Home extends React.PureComponent {

  render() {
    const { match, apiDataRules = [], apis = [] } = this.props
    return <section className="rule-manager-home">
      <header>
        <Link to={`${match.url}/creator`}><Summary title="+" value="创建数据规则" className="primary"/></Link>
        <Summary title="数据规则" value={apiDataRules.length}/>
      </header>
      {this.renderTable(apiDataRules, apis)}
    </section>
  }

  renderTable(rows, apis) {
    const { Column } = Table
    const { match } = this.props
    return <Table dataSource={rows}>
      <Column
        title="规则备注"
        dataIndex="remark"
        key="remark"
        sorter={(a, b) => a.remark > b.remark}
      />
      <Column
        title="对应接口"
        key="api"
        render={(text, record) => {
          const { api } = record
          const [ Api, ...rest ] = apis.filter(i => i.id === api)
          if (Api && rest.length === 0) {
            return Api.uri
          }
        }}
      />
      <Column
        title="规则类型"
        key="mode"
        sorter={(a, b) => a.mode > b.mode}
        render={(text, record) => {
          const Map = {
            testcase: '测试用例',
            func: '执行函数'
          }
          return Map[record.mode]
        }}
      />
      <Column
        title="操作"
        key="operation"
        render={(text, record) => {
          return <Link to={`${match.url}/${record.id}`}>编辑</Link>
        }}
      />
    </Table>
  }
}

export default withRouter(connect(state => {
  const { apiDataRules = [], apis = [] } = state
  return { apiDataRules, apis }
})(Home))