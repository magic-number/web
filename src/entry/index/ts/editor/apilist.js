import React from 'react'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'

import Checkbox from 'antd/lib/checkbox'
import Button from 'antd/lib/button'
import Table from 'antd/lib/table'
import 'antd/lib/table/style/index.less'
import 'antd/lib/form/style/index.less'
import 'antd/lib/icon/style/index.less'
import 'antd/lib/button/style/index.less'
import store from '../../../../service/redux'
import { clone } from '../../../../util'
import './apilist.less'

class ApiList extends React.PureComponent {

  constructor(props, context, updater) {
    super(props, context, updater)
    const { apis: APIs = [] } = store.getState()
    const { formData = {} } = props
    const { apis = [] } = formData

    const checkMap = {}
    APIs.forEach(api => {
      checkMap[api.id] = apis.filter(i => i === api.id).length === 1
    })

    this.state = {
      APIs,
      checkMap,
    }
  }

  onSubmit = () => {
    const { checkMap = {} } = this.state
    const { onData } = this.props
    const ret = []
    Object.keys(checkMap).forEach(k => {
      if (checkMap[k]) {
        ret.push(k)
      }
    })
    onData(ret)
  }

  render() {
    const { onPre } = this.props
    return <section className="api-list">
      <Button.Group className="action" size="large">
          <Button onClick={event => onPre(event)}>
            <Icon type="left" />上一步
          </Button>
          <Button onClick={this.onSubmit}>
            下一步<Icon type="right" />
          </Button>
      </Button.Group>
      {this.renderTableList()}
    </section>
  }

  renderTableList() {
    const { APIs, checkMap } = this.state
    const { Column } = Table
    return <Table dataSource={APIs}>
      <Column
        title=""
        key="checkbox"
        render={(text, record) => {
          return <Checkbox key={record.id} checked={checkMap[record.id]} onChange={(event) => {
            const nmap = clone(checkMap)
            nmap[record.id] = event.target.checked
            this.setState({
              checkMap: nmap,
            })
          }}/>;
        }}
      />
      <Column
        title="URI"
        dataIndex="uri"
        key="uri"
        sorter={(a, b) => a.uri > b.uri }
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
        dataIndex="method"
        key="method"
        sorter={(a, b) => a.method > b.method}
      />
    </Table>
  }
}

export default ApiList
