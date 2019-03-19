import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Editor from './editor'
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
        url: Rpath('testsuites')
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
      const [ ts, api ] = ps
      store.dispatch(ActionMap.testsuites(ts))
      store.dispatch(ActionMap.apis(api))
      return setLoadStatus()
    })
  }

  render() {
    const { match } = this.props;
    return <Switch className="testsuite-manager">
            <Route exact path={`${match.url}`} component={Home} />
            <Route exact path={`${match.url}/creator`} component={Editor} />
            <Route path={`${match.url}/:id`} component={({ match }) => {
              const { params } = match
              const { id } = params
              const { testsuites } = store.getState()
              const ts = testsuites.filter(t => t.id === id)
              if (ts && ts.length === 1) {
                return <Editor formData={ts[0]} />
              }
              return null
            }} />
        </Switch>
  }
}

export default LoadingHOC(withRouter(Manager))
