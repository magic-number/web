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
      }).then((res) => {
        const { data = [], success = false } = res;
        if (success) {
          return data;
        }
        return Promise.reject(res);
      }),
      rpc({
        url: Rpath('api'),
      }).then((res) => {
        const { data = [], success = false } = res;
        if (success) {
          return data;
        }
        return Promise.reject(res);
      }),
    ];
  }

  componentDidFetch(ps) {
    const [rules, apis] = ps;
    store.dispatch(ActionMap.apiDataRules(rules));
    store.dispatch(ActionMap.apis(apis));
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Home} />
        <Route exact path={`${match.url}/creator`} component={Editor} />
      </Switch>
    );
  }
}

export default withRouter(LoadingHOC(Manager));
