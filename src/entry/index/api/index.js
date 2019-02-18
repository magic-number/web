import React from 'react'
import Card from 'antd/lib/card'
import 'antd/lib/card/style/index.less'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import LeftPanel from '../leftpanel'
import Creator from './creator'
import './index.less'

class ApiHome extends React.PureComponent {
  render() {
    const { match } = this.props
    return <section className="api-manager-home">
      <Link to={`${match.url}/creator`}><Card className="add-container">添加接口</Card></Link>
    </section>
  }
}

const _ApiHome = withRouter(ApiHome)


export default function Api ({ match }) {
  const renderItem = api => <Link to={`${match.url}/${api.id}`}>{api.id}</Link>
  return <section className="api-manager">
          <LeftPanel renderItem={renderItem}/>
          <Switch>
            <Route exact path={match.url} component={_ApiHome} />
            <Route exact path={`${match.url}/creator`} component={Creator} />
            <Route exact path={`${match.url}/:id`} component={Creator} />
          </Switch>
        </section>
}
