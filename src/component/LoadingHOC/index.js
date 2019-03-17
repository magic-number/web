import React from 'react'

const LoadingHOC = WrapperComponent => {
  class LoadingHOCComponent extends React.PureComponent {
    constructor(props, context, updater) {
      super(props, context, updater)
      this.state = {
        status: 'loading',
        content: <WrapperComponent {...this.props} setLoadStatus={this.setLoadStatus} />
      }
    }

    setLoadStatus = (status = 'done') => {
      return new Promise((resolve,) => {
        this.setState({
          status,
        }, resolve)
      })
    }

    renderLoading = () => {
      return <div>Loading</div>
    }

    renderFail = () => {
      return <div>Loading Fail</div>
    }

    render() {
      const { status, content } = this.state
      const { renderLoading = this.renderLoading, renderFail = this.renderFail } = this.props
      switch (status) {
        case 'fail':
          return renderFail()
        case 'done':
          return content;
        case 'loading':
        default:
          return <React.Fragment>
            {renderLoading()}
            <div style={{ display: 'none' }}>{content}</div>
          </React.Fragment>
      }
    }
  }

  return LoadingHOCComponent
}

export default LoadingHOC
