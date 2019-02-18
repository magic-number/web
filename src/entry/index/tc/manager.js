import React from 'react'
import Card from 'antd/lib/card'
import { withRouter } from 'react-router-dom'
import 'antd/lib/card/style/index.less'
import 'antd/lib/table/style/index.less'
import 'antd/lib/pagination/style/index.less'

class Manager extends React.PureComponent {
  render() {
    const { match } = this.props
    return <section>{JSON.stringify(match.params)}</section>
  }
}

export default withRouter(Manager)
