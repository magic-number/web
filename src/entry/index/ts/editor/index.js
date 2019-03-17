import React from 'react'
import Steps from 'antd/lib/steps'
import { rpc } from 'FETCH'
import { Rpath } from '../../../../common'
import FormHOC from '../../../../component/FormHOC'
import Base from './base'
import ApiList from './apilist'
import 'antd/lib/steps/style/index.less'
import './index.less'
import { clone } from '../../../../util'

const { Step } = Steps
const BaseSection = FormHOC(Base)
const ApiSection = FormHOC(ApiList)

class Editor extends React.PureComponent {

  constructor(props, context, updater) {
    super(props, context, updater)
    this.state = {
      current: 0,
      testsuite: props.formData
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
    const { testsuite } = this.state
    switch(current) {
      case 0:
        return <BaseSection onData={this.baseData} formData={testsuite}/>
      case 1:
        return <ApiSection onData={this.apiData} formData={testsuite} onPre={() => this.setState({ current: 0 })} />
      case 2:
        return <div>API Data Rule</div>
      default:
        throw new Error(`illegal step index ${current}`)
    }
  }

  /**
   * 创建/更新测试场景基本信息
   */
  baseData = data => {
    const { testsuite } = this.state
    const nts = clone(testsuite)
    rpc({
      url: Rpath('testsuites'),
      method: 'POST',
      data: {
        ...nts,
        ...data,
      },
    }).then(res => {
      const { data } = res
      this.setState({
        current: 1,
        testsuite: data
      })
    })
  }

  /**
   * 更新测试场景的api数据
   */
  apiData = data => {
    const { testsuite } = this.state
    const nts = clone(testsuite)
    nts.apis = data
    rpc({
      url: Rpath('testsuites'),
      method: 'POST',
      data: nts,
    }).then(res => {
      const { data } = res
      this.setState({
        current: 2,
        testsuite: data,
      })
    })
  }
  
}

export default Editor;
