import React from 'react';
import { Button } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { rpc } from 'FETCH';
import Slopegraph from '../../../component/Slopegraph';
import LoadingHOC from '../../../component/LoadingHOC';
import store, { ActionMap } from '../../../service/redux';
import { Rpath } from '../../../common';
import './relation.less';
import ButtonGroup from 'antd/lib/button/button-group';

class Relation extends React.PureComponent {
  hasConnection = (tc, rule) => rule.mode === 'testcase' && tc.id === rule.data

  componentFetchData() {
    return [
      rpc({
        url: Rpath('apidatarule'),
      }).then(({ data = [] }) => data),
      rpc({
        url: Rpath('testcase'),
      }).then(({ data = [] }) => data),
    ];
  }

  componentDidFetch([rules, testcases]) {
    store.dispatch(ActionMap.apiDataRules(rules));
    store.dispatch(ActionMap.testcases(testcases));
  }

  renderLeftItem = item => ({ text: item.name, textAnchor: 'end', fontSize: 18 });

  renderRightItem = item => ({ text: item.remark, fontSize: 18 });

  render() {
    const {
      match, testcases, apiDataRules, apis, history,
    } = this.props;
    const { params } = match;
    const { id } = params;
    const tcs = testcases.filter(i => i.api === id);
    const rules = apiDataRules.filter(i => i.api === id);
    const [api] = apis.filter(i => i.id === id);
    return (
      <section className="relation">
        <div className="api-info">
          <div>
            接口URI:
            {api.uri}
          </div>
          <div>
            接口备注:
            {api.remark}
          </div>
        </div>
        <Slopegraph
          width={1000}
          className="slopegraph"
          itemHeight={40}
          topPadding={32}
          left={tcs}
          right={rules}
          renderLeftItem={this.renderLeftItem}
          renderRightItem={this.renderRightItem}
          hasConnection={this.hasConnection}
          leftHeader={{ text: '测试用例', fontSize: 20, fontWeight: 'bold' }}
          rightHeader={{ text: '数据切换规则', fontSize: 20, fontWeight: 'bold' }}
        />
        <ButtonGroup>
          <Link to="/tc/creator"><Button>创建测试用例</Button></Link>
          <Link to={`/rule/creator/api/${id}`}><Button>创建数据规则</Button></Link>
          <Button onClick={() => history.goBack()}>返回</Button>
        </ButtonGroup>
      </section>
    );
  }
}

export default withRouter(
  connect(({ testcases, apiDataRules, apis }) => ({ testcases, apiDataRules, apis }))(LoadingHOC(Relation)),
);
