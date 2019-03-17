import React from 'react'
import Steps from 'antd/lib/steps'
import 'antd/lib/steps/style/index.less'
import './creator.less'
const { Step } = Steps
class Creator extends React.PureComponent {

  constructor(props, context, updater) {
    super(props, context, updater)
    const { match } = this.props
    const { params } = match
    this.state = {
      current: 0,
      mode: params.id ? 'edit' : 'create'
    }
  }

  render() {
    const { current } = this.state
    return <section className="testsuite-creator">
      <Steps current={current} className="progress">
        <Step title="场景基本信息"/>
        <Step title="选择包含的API" description="选择场景涉及的API"/>
        <Step title="配置数据规则"/>
      </Steps>
      {this.renderContent(current)}
    </section>
  }

  renderContent(current) {
    switch(current) {
      case 0:
        return <div>基本信息</div>
      case 1:
        return <div>接口列表</div>
      case 2:
        return <div>API Data Rule</div>
      default:
        throw new Error(`illegal step index ${current}`)
    }
  }
}

export default Creator;
