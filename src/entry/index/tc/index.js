import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Home from './home'
import Editor from './home'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import LoadingHOC from '../../../component/LoadingHOC'
import './index.less'

export class Manager extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)

    rpc({
      url: Rpath('testcase')
    }).then(res => {
      const { data = [], success = false } = res
      if (success) {
        return data
      }
      return Promise.reject(res)
    }).then(tcs => {
      const { setLoadStatus } = props
      store.dispatch(ActionMap.testcases(tcs))
      return setLoadStatus()
    })

  }

  render() {
    const { match } = this.props;
    return <Switch className="testcase-manager">
            <Route exact path={`${match.url}`} component={Home} />
            <Route exact path={`${match.url}/creator`} component={Editor} />
            <Route path={`${match.url}/:id`} component={({ match }) => {
              const { params } = match
              const { id } = params
              const { testcases } = store.getState()
              const [ ts, ...rest ] = testcases.filter(t => t.id === id)
              if (ts && rest.length === 0) {
                return <Editor formData={ts} />
              }
            }} />
        </Switch>
  }
}

export default LoadingHOC(withRouter(Manager))
