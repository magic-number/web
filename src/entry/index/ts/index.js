import React from 'react'
import Tree from 'antd/lib/tree'
import Steps from 'antd/lib/steps'
import 'antd/lib/tree/style/index.less'
import 'antd/lib/steps/style/index.less'

class TestSuitManager extends React.PureComponent {
  render() {
    const { TreeNode } = Tree
    const { Step } = Steps
    return <section>
      <Steps>
        <Step title="请选择Test Suit中要包含的接口" />
        <Step title="配置接口返回规则" />
        <Step title="完成" />
      </Steps>
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
      >
        <TreeNode title="parent 1" key="0-0" />
        <TreeNode title="leaf" key="0-0-0-1" />
        <TreeNode title="leaf" key="0-0-0-0" />
        <TreeNode title="parent 1-0" key="0-0-0" />
        <TreeNode title="parent 1-1" key="0-0-1" />
        <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
      </Tree>
    </section>
  }
}

export default TestSuitManager
