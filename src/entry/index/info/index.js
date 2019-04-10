import React from 'react';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import { Rpath } from '../../../common';
import store, { ActionMap } from '../../../service/redux';
import LoadingHOC from '../../../component/LoadingHOC';
import SessionView from './sessionView';
import './index.less';

class Info extends React.PureComponent {
  componentFetchData() {
    return [rpc({
      url: Rpath('info'),
    }).then((res) => {
      const { data = [] } = res;
      return data;
    }),
    rpc({
      url: Rpath('testsuites'),
    }).then((res) => {
      const { data = [] } = res;
      return data;
    }),
    ];
  }

  componentDidFetch([sessions, testsuites]) {
    store.dispatch(ActionMap.sessions(sessions));
    store.dispatch(ActionMap.testsuites(testsuites));
  }

  static renderEmpty() {
    return <section>暂无客户端链接到服务器</section>;
  }

  render() {
    const { sessions = [] } = this.props;
    if (sessions.length === 0) {
      return Info.renderEmpty();
    }
    return <section>{sessions.map(s => <SessionView key={s.id} data={s} />)}</section>;
  }
}


export default connect(({ sessions }) => ({ sessions }))(LoadingHOC(Info));
