import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import Alert from 'antd/lib/alert'
import 'antd/lib/alert/style/index.less'
import { Provider } from "react-redux"
import { store } from "../../service/redux"
import { setHost } from '../../common'
import { parseQueryString } from '../../util'

const query = parseQueryString()
const { magicServer } = query

if (magicServer) {
  setHost(query.magicServer)

  ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
  )
} else {
  ReactDOM.render(
  <section>
    <Alert
      type="error"
      message="缺少MagicServer信息"
      description="请输入MagicServer地址"
    />
    <input placeholder="http://${your magic server}"/>
  </section>
  , document.getElementById('root'))
}
