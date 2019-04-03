import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { rpc } from 'FETCH';
import Home from './home';
import Editor from './editor';
import { Rpath } from '../../../common';
import store, { ActionMap } from '../../../service/redux';
import LoadingHOC from '../../../component/LoadingHOC';

export class Manager extends React.PureComponent {
  componentFetchData() {
    return [
      rpc({
        url: Rpath('apidatarule'),
      }).then(({ data = [] }) => data),
      rpc({
        url: Rpath('api'),
      }).then(({ data = [] }) => data),
      rpc({
        url: Rpath('testcase'),
      }).then(({ data = [] }) => data),
    ];
  }

  componentDidFetch(ps) {
    const [rules, apis, testcases] = ps;
    store.dispatch(ActionMap.apiDataRules(rules));
    store.dispatch(ActionMap.apis(apis));
    store.dispatch(ActionMap.testcases(testcases));
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Home} />
        <Route exact path={`${match.url}/creator`} component={Editor} />
        <Route exact path={`${match.url}/creator/api/:api`} component={Editor} />
        <Route
          path={`${match.url}/:id`}
          component={({ match: _match }) => {
            const { params } = _match;
            const { id } = params;
            const { apiDataRules: rows } = store.getState();
            const [item, ...rest] = rows.filter(t => t.id === id);
            if (item && rest.length === 0) {
              return <Editor formData={item} />;
            }
            return null;
          }}
        />
      </Switch>
    );
  }
}

export default withRouter(LoadingHOC(Manager));
