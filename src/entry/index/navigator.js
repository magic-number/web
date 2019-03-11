import React from 'react'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import { Link } from 'react-router-dom'
import 'antd/lib/menu/style/index.less'
import 'antd/lib/icon/style/index.less'
import 'antd/lib/input/style/index.less'
import './navigator.less'

class Navigator extends React.PureComponent {
  render() {
    const { navs = [], className = '' } = this.props
    return <nav className={`${className} top-nav`}>
      <div className="left">
        <Link className="logo" to="/">Magic Number</Link>
      </div>
      <Menu mode="horizontal">
        {navs.map(nav => {
          const { text, path } = nav
          return <Menu.Item key={path}>
              <Link to={path}>{text}</Link>
            </Menu.Item>
        })}
      </Menu>
    </nav>
  }
}

export default Navigator
