import React from 'react'
import { Button, Checkbox, Icon, Table } from 'antd'
import { connect } from 'react-redux'
import { rpc } from 'FETCH'
import { Rpath } from '../../../../common'
import store, { ActionMap } from '../../../../service/redux'
import FormHOC from '../../../../component/FormHOC'
import LoadingHOC from '../../../../component/LoadingHOC'

import { clone } from '../../../../util'

import './apilist.less'

class ApiList extends React.PureComponent {

  componentFetchData() {
    return rpc({
      url: Rpath('api')
    }).then(res => {
      const { data = [], success = false } = res
      if (success) {
        return data
      }
      return Promise.reject(res)
    })
  }

  componentDidFetch(APIs) {
    store.dispatch(ActionMap.apis(APIs))
    const { formData = {} } = this.props
    const { checkMap = {} } = this.state
    const { apis = [] } = formData
    APIs.forEach(api => {
      checkMap[api.id] = apis.filter(i => i === api.id).length === 1
    })
    this.setState({
      checkMap
    })
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
    const { checkMap = {} } = this.state
    const { apis: APIs } = this.props
    const { Column } = Table
    return <Table dataSource={APIs} rowKey="id">
      <Column
        title=""
        key="checkbox"
        render={(text, record) => {
          if (!record) {
            debugger
          }
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

export default FormHOC(connect(state => {
  const { apis } = state
  return { apis }
})(LoadingHOC(ApiList)))
