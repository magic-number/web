import { clone } from '../../util'

const ActionMap = {
  /**
   * api接口
   */
  apis: [],
  /**
   * 导航栏
   */
  navs: [
    { path: '/info', text: '服务状态' },
    { path: '/api', text: '接口管理' },
    { path: '/ts', text: '测试场景管理' },
    { path: '/rule', text: '数据规则管理' },
    { path: '/tc', text: '测试用例管理' },
    { path: '/coverage', text: '测试数据覆盖率' },
    { path: '/about', text: '关于' },
  ],
  /**
   * 所有的testsuite
   */
  testsuites: [],

  /**
   * 数据切换规则
   */
  apiDataRules: [],
  /**
   * 当前选中的testsuite
   */
  currentTestSuite: null,
}

const createAction = (type) => {
  return (data) => {
    return {
      type,
      payload: data,
    }
  }
}

const initialState = clone(ActionMap)

Object.keys(initialState).forEach(k => ActionMap[k] = createAction(k))

export {
  ActionMap,
  initialState,
  createAction
}
