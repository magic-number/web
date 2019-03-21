import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import Editor from './editor';
import Home from './home';
import { Rpath } from '../../../common';
import store, { ActionMap } from '../../../service/redux';
import LoadingHOC from '../../../component/LoadingHOC';

export class Manager extends React.PureComponent {
  componentFetchData() {
    return rpc({
      url: Rpath('testsuites'),
    }).then((res) => {
      const { data = [], success = false } = res;
      if (success) {
        return data;
      }
      return Promise.reject(res);
    });
  }

  componentDidFetch(ts) {
    // const [ ts, api ] = ps
    store.dispatch(ActionMap.testsuites(ts));
    // store.dispatch(ActionMap.apis(api))
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { match, testsuites } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Home} />
        <Route exact path={`${match.url}/creator`} component={Editor} />
        <Route
          path={`${match.url}/:id`}
          component={({ match: _match }) => {
            const { params } = _match;
            const { id } = params;
            const [ts, ...rest] = testsuites.filter(t => t.id === id);
            if (ts && rest.length === 0) {
              return <Editor formData={ts} />;
            }
            return null;
          }}
        />
      </Switch>
    );
  }
}

export default withRouter(connect((state) => {
  const { testsuites } = state;
  return { testsuites };
})(LoadingHOC(Manager)));
