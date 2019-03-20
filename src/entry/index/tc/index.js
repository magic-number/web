import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from './home'
import Editor from './editor'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import LoadingHOC from '../../../component/LoadingHOC'
import './index.less'

export class Manager extends React.PureComponent {

  componentFetchData() {
    return rpc({
      url: Rpath('testcase')
    }).then(res => {
      const { data = [], success = false } = res
      if (success) {
        return data
      }
      return Promise.reject(res)
    })
  }

  componentDidFetch(tcs) {
    store.dispatch(ActionMap.testcases(tcs))
  }

  render() {
    const { match, testcases } = this.props;
    return <Switch>
            <Route exact path={`${match.url}`} component={Home} />
            <Route exact path={`${match.url}/creator`} component={Editor} />
            <Route path={`${match.url}/:id`} component={({ match }) => {
              const { params } = match
              const { id } = params
              const [ tc, ...rest ] = testcases.filter(t => t.id === id)
              if (tc && rest.length === 0) {
                return <Editor formData={tc} />
              }
              return null
            }} />
        </Switch>
  }
}

export default withRouter(connect(state => {
  const { testcases } = state
  return { testcases }
})(LoadingHOC(Manager)))
