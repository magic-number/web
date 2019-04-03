import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import Home from './home';
import Editor from './editor';
import Relation from './relation';
import { Rpath } from '../../../common';
import store, { ActionMap } from '../../../service/redux';
import LoadingHOC from '../../../component/LoadingHOC';

export class Manager extends React.PureComponent {
  componentFetchData() {
    return rpc({
      url: Rpath('api'),
    }).then(({ data = [] }) => data);
  }

  componentDidFetch(apis) {
    store.dispatch(ActionMap.apis(apis));
  }

  render() {
    const { match, apis } = this.props;
    return (
      <Switch>
        <Route exact path={`${match.url}`} component={Home} />
        <Route exact path={`${match.url}/creator`} component={Editor} />
        <Route exact path={`${match.url}/:id/relation`} component={Relation} />
        <Route
          path={`${match.url}/:id`}
          component={({ match: _match }) => {
            const { params } = _match;
            const { id } = params;
            const [tc, ...rest] = apis.filter(t => t.id === id);
            if (tc && rest.length === 0) {
              return <Editor formData={tc} />;
            }
            return null;
          }}
        />

      </Switch>
    );
  }
}

export default withRouter(connect((state) => {
  const { apis } = state;
  return { apis };
})(LoadingHOC(Manager)));
