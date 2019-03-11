import React from 'react'
import { connect } from 'react-redux'
import Menu from 'antd/lib/menu'
import { Link } from 'react-router-dom'
import { rpc } from 'FETCH'
import { Rpath } from '../../common'
import { ActionMap } from '../../service/redux/action'
import { store } from '../../service/redux'
import 'antd/lib/menu/style/index.less'
import './leftpanel.less'

class LeftPanel extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)

  }
  render() {
    const { apis = [], renderItem = api => api.id } = this.props
    return    <Menu>
      {apis.map(api => {
        return <Menu.Item key={api.id}>
            {renderItem(api)}
          </Menu.Item>
      })}
    </Menu>
  }
}

export default connect(state => {
  const { apis = [] } = state
  return { apis }
})(LeftPanel)
