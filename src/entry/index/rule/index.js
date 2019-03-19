import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Home from './home'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import { batchPromise } from '../../../util'
import LoadingHOC from '../../../component/LoadingHOC'
import './index.less'

export class Manager extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)

    batchPromise([
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
    ]).then(ps => {
      const { setLoadStatus } = props
      const [ rules, apis ] = ps
      store.dispatch(ActionMap.apiDataRules(rules))
      store.dispatch(ActionMap.apis(apis))
      return setLoadStatus()
    })
  }

  render() {
    const { match } = this.props;
    return <Switch className="testsuite-manager">
            <Route exact path={`${match.url}`} component={Home} />
        </Switch>
  }
}

export default LoadingHOC(withRouter(Manager))
