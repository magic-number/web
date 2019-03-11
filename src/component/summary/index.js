import React from 'react'
import './index.less'

class Summary extends React.PureComponent{
  render() {
    const { title, value, titleCls = '', valueCls = '', className = '', ...rest } = this.props
    return <section className={`summary ${className}`} {...rest}>
      <div className={`summary-title ${titleCls}`}>{title}</div>
      <div className={`summary-value ${valueCls}`}>{value}</div>
    </section>
  }
}

export default Summary
