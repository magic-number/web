import React from 'react'
import List from 'antd/lib/list'
import 'antd/lib/list/style/index.less'
import { Rpath } from '../../common'
import { rpc } from 'FETCH'
import ReactJson from 'react-json-view'

class Info extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)
    this.state = {
      history: []
    }
    rpc({
      url: Rpath('info')
    }).then(res => {
      const { data = [] } = res
      this.setState({
        history: data,
      })
    })
  }

  render() {
    const { history = [] } = this.state
    return <List
      itemLayout="horizontal"
      dataSource={history}
      renderItem={item => {
        const { uri, params, result, createTime, finishTime } = item
        return <List.Item>
          <List.Item.Meta
            title={<a href="https://ant.design">{uri}</a>}
            description={<div>
                <header>请求时间{} | 请求参数</header>
                <ReactJson src={params} />
                <header>返回时间{} | 返回结果</header>
                <ReactJson src={result}/>
            </div>}
          /></List.Item>
      }}
    />
  }
}

export default Info
