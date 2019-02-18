import React from 'react'
import Statistic from 'antd/lib/statistic'
import Dropdown from 'antd/lib/dropdown'
import Timeline from 'antd/lib/timeline'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Collapse from 'antd/lib/collapse'
import ReactJson from 'react-json-view'
import { connect } from 'react-redux'
import 'antd/lib/statistic/style/index.less'
import 'antd/lib/dropdown/style/index.less'
import 'antd/lib/timeline/style/index.less'
import 'antd/lib/collapse/style/index.less'
import 'antd/lib/menu/style/index.less'
import 'antd/lib/icon/style/index.less'
import { rpc } from 'FETCH'
import { Rpath } from '../../../common'
import { ActionMap } from '../../../service/redux/action'
import './index.less'

class Info extends React.PureComponent {
  constructor(props, context, updater) {
    super(props, context, updater)
    rpc({
      url: Rpath('testsuite')
    }).then(res => {
      const { data = {} } = res
      const { testsuites, selected } = data
      const { dispatch } = this.props
      dispatch(ActionMap.testsuites(testsuites))
      dispatch(ActionMap.currentTestSuite(selected))
    })
  }
  render() {
    const { testsuites, currentTestSuite } = this.props
    return <section className="server-info">
      <div className="summary">
        <Statistic title="API数量" value={20} />
        <Statistic title="Test case数量" value={100} />
        <Statistic title="Test suit数量" value={10} />
        <div>
          <header>当前测试场景</header>
          <Dropdown overlay={<Menu>
              {
                testsuites.map(ts => {
                  const name = ts.replace(/\.json$/,'')
                  return <Menu.Item key={name} onClick={() => {
                    if (name !== currentTestSuite) {
                      rpc({
                        url: Rpath('testsuite'),
                        method: 'POST',
                        data: {
                          testsuite: name
                        }
                      }).then(res => {
                        const { dispatch } = this.props
                        dispatch(ActionMap.currentTestSuite(name))
                      })
                    } else {
                      rpc({
                        url: Rpath('testsuite'),
                        method: 'POST',
                        data: {
                          clear: true,
                        }
                      }).then(res => {
                        const { dispatch } = this.props
                        dispatch(ActionMap.currentTestSuite(null))
                      })
                    }
                  }}>
                    <a target="_blank" rel="noopener noreferrer">{name}{name === currentTestSuite && <Icon type="check" style={{ color: 'green' }} />}</a>
                  </Menu.Item>
                })
              }
          </Menu>}><a className="ant-dropdown-link">{currentTestSuite && <Icon type="check" style={{ color: 'green' }} />} {currentTestSuite || '未选中TestSuite'} <Icon type="down" /></a>
          </Dropdown>
        </div>
      </div>
      <div className="request-stack">
        <header>最近20次请求详情</header>
        <Timeline>
          <Timeline.Item>
            <Collapse bordered={false}>
              <Collapse.Panel header="alipay.merchant.activitycenter.activity.manage.page.info">
              <div>请求时间: 2018/01/12 12:00:03.212</div>
              <ReactJson name="请求参数" src={{ pageSize: 1}}/>
              <ReactJson name="返回结果" src={{ pageSize: 1, data: [] }}/>
              </Collapse.Panel>
            </Collapse>
          </Timeline.Item>
          <Timeline.Item>
            <Collapse bordered={false}>
                <Collapse.Panel header="alipay.merchant.activitycenter.activity.manage.page.info">
                <div>请求时间: 2018/01/12 12:00:03.212</div>
                <ReactJson name="请求参数" src={{ pageSize: 1}}/>
                <ReactJson name="返回结果" src={{ pageSize: 1, data: [] }}/>
                </Collapse.Panel>
              </Collapse>
          </Timeline.Item>
        </Timeline>
      </div>
    </section>
  }
}


export default connect(state => {
  const { testsuites, currentTestSuite } = state
  return { testsuites, currentTestSuite }
})(Info)
