import React from 'react'
import { connect } from 'react-redux'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import Navigator from './navigator'
import ApiManager from './api'
import Info from './info/index'
import TestSuitManager from './ts'
import Testcase from './tc'
import './app.less'


class App extends React.PureComponent {

  render() {
    return <Router>
      <section className="magic">
        <Navigator navs={this.props.navs}/>
        <Switch>
          <Route exact path="/" component={() => "Home"} />
          <Route path="/info" component={Info} />
          <Route path="/api" component={ApiManager} />
          <Route path="/tc" component={Testcase} />
          <Route path="/ts" component={TestSuitManager} />
          <Route path="/coverage" component={() => "测试数据覆盖率"} />
          <Route path="/about" component={() => "关于"} />
        </Switch>
      </section>
    </Router>
  }
}

export default connect(state => {
  const { navs = [] } = state
  return { navs }
})(App)
