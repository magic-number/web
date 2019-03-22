import React from 'react';
import { message, Steps } from 'antd';
import { withRouter } from 'react-router-dom';
import { rpc } from 'FETCH';
import { Rpath } from '../../../../common';
import { clone } from '../../../../util';
import Base from './base';
import ApiList from './apilist';
import RuleList from './rulelist';
import './index.less';

const { Step } = Steps;

class Editor extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater);
    this.state = {
      current: 0,
      testsuite: props.formData,
    };
  }

  /**
   * 创建/更新测试场景基本信息
   */
  baseData = (data) => {
    const { testsuite } = this.state;
    const nts = clone(testsuite);
    rpc({
      url: Rpath('testsuites'),
      method: 'POST',
      data: {
        ...nts,
        ...data,
      },
    }).then((res) => {
      const { data: ndata } = res;
      this.setState({
        current: 1,
        testsuite: ndata,
      });
    });
  }

  /**
   * 更新测试场景的api数据
   */
  apiData = (data) => {
    const { testsuite } = this.state;
    const nts = clone(testsuite);
    nts.apis = data;
    rpc({
      url: Rpath('testsuites'),
      method: 'POST',
      data: nts,
    }).then((res) => {
      const { data: ndata } = res;
      this.setState({
        current: 2,
        testsuite: ndata,
      });
    });
  }

  /**
   * 更新测试场景的rule数据
   */
  ruleData = (data) => {
    const { testsuite } = this.state;
    const nts = clone(testsuite);
    nts.apiDataRules = data;
    rpc({
      url: Rpath('testsuites'),
      method: 'POST',
      data: nts,
    }).then(() => {
      const { history } = this.props;
      message.success('操作成功！');
      history.goBack();
    });
  }

  renderContent(current) {
    const { testsuite } = this.state;
    switch (current) {
      case 0:
        return <Base onData={this.baseData} formData={testsuite} />;
      case 1:
        return (
          <ApiList
            onData={this.apiData}
            formData={testsuite}
            onPre={() => this.setState({ current: 0 })}
          />
        );
      case 2:
        return (
          <RuleList
            onData={this.ruleData}
            formData={testsuite}
            onPre={() => this.setState({ current: 1 })}
          />
        );
      default:
        throw new Error(`illegal step index ${current}`);
    }
  }

  render() {
    const { current } = this.state;
    return (
      <section className="ts-editor">
        <Steps current={current} className="progress">
          <Step title="场景基本信息" />
          <Step title="选择包含的API" description="选择场景涉及的API" />
          <Step title="配置数据规则" />
        </Steps>
        {this.renderContent(current)}
      </section>
    );
  }
}

export default withRouter(Editor);
