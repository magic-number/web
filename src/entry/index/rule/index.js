import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Home from './home'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import LoadingHOC from '../../../component/LoadingHOC'
import './index.less'

export class Manager extends React.PureComponent {

  componentFetchData() {
    return [
      rpc({
        url: Rpath('apidatarule')
      }).then(res => {
        const { data = [], success = false } = res
        if (success) {
          return data
        }
        return Promise.reject(res)
      }),
      rpc({
        url: Rpath('api')
      }).then(res => {
        const { data = [], success = false } = res
        if (success) {
          return data
        }
        return Promise.reject(res)
      })
    ]
  }

  componentDidFetch(ps) {
    const [ rules, apis ] = ps
    store.dispatch(ActionMap.apiDataRules(rules))
    store.dispatch(ActionMap.apis(apis))
  }

  render() {
    const { match } = this.props;
    return <Switch className="testsuite-manager">
            <Route exact path={`${match.url}`} component={Home} />
        </Switch>
  }
}

export default withRouter(LoadingHOC(Manager))
