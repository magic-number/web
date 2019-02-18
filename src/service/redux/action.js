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
    { path: '/info', text: '服务状态管理' },
    { path: '/stat', text: '统计分析数据' },
    { path: '/api', text: '后端接口管理' },
    { path: '/tc', text: '测试数据管理' },
    { path: '/ts', text: '测试集合管理' },
    { path: '/coverage', text: '测试数据覆盖率' },
    { path: '/about', text: '关于' },
  ],
  /**
   * 所有的testsuite
   */
  testsuites: [],
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
