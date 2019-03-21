import React from 'react';
import Menu from 'antd/lib/menu';
import { NavLink, withRouter } from 'react-router-dom';
import 'antd/lib/menu/style/index.less';
import 'antd/lib/icon/style/index.less';
import 'antd/lib/input/style/index.less';
import './navigator.less';

class Navigator extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      active: null,
    };
  }

  render() {
    const { navs = [], className = '' } = this.props;
    const { active } = this.state;
    return (
      <nav className={`${className} top-nav`}>
        <div className="left">
          <NavLink className="logo" to="/">Magic Number</NavLink>
        </div>
        <Menu mode="horizontal">
          {navs.map((nav) => {
            const { text, path } = nav;
            return (
              <Menu.Item key={path} className={active === nav ? 'ant-menu-item-active' : ''}>
                <NavLink
                  to={path}
                  isActive={(match) => {
                    if (match) {
                      setTimeout(() => this.setState({
                        active: nav,
                      }), 100);
                    }
                  }}
                >
                  {text}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </nav>
    );
  }
}

export default withRouter(Navigator);
