import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Editor from './editor'
import Home from './home'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import store, { ActionMap } from '../../../service/redux'
import LoadingHOC from '../../../component/LoadingHOC'
import './index.less'

export class Manager extends React.PureComponent {

  componentFetchData() {
    return rpc({
      url: Rpath('testsuites')
    }).then(res => {
      const { data = [], success = false } = res
      if (success) {
        return data
      }
      return Promise.reject(res)
    })
    /*
    return [
      
    ]
    */
  }

  componentDidFetch(ts) {
    // const [ ts, api ] = ps
    store.dispatch(ActionMap.testsuites(ts))
    // store.dispatch(ActionMap.apis(api))
  }

  render() {
    const { match, testsuites } = this.props;
    return <Switch className="testsuite-manager">
            <Route exact path={`${match.url}`} component={Home} />
            <Route exact path={`${match.url}/creator`} component={Editor} />
            <Route path={`${match.url}/:id`} component={({ match }) => {
              const { params } = match
              const { id } = params
              const [ ts, ...rest ] = testsuites.filter(t => t.id === id)
              if (ts && rest.length === 0) {
                return <Editor formData={ts} />
              } else {
                return null
              }
            }} />
        </Switch>
  }
}

export default withRouter(connect(state => {
  const { testsuites } = state
  return { testsuites }
})(LoadingHOC(Manager)))
