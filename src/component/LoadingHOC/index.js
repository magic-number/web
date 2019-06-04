import React from 'react';
import { Skeleton } from 'antd';

const renderLoading = () => <Skeleton active />;

const renderFail = () => <div>Loading Fail</div>;

/**
 * Loading的通用组件
 * 必须作为ReactComponent的直接高阶函数
 * 子组件必须实现componentFetchData方法，该方法必须返回promise或者promise数组
 * componetFetchData中的promise将作为参数传递给componentDidFetch
 */
const LoadingHOC = (WrapperComponent, conf) => {
  class LoadingHOCComponent extends WrapperComponent {
    constructor(props, context, updater) {
      super(props, context, updater);
      const state = this.state || {};
      // eslint-disable-next-line no-underscore-dangle
      state.__loading__ = 'loading';
      this.state = state;
      this.reload();
    }

    reload = () => {
      try {
        const ps = super.componentFetchData();
        const didFetch = super.componentDidFetch && super.componentDidFetch.bind(this);
        return this.fetchData(ps).then((result) => {
          if (didFetch) {
            return didFetch(result).then(() => this.setState({
              __loading__: 'done',
            }, () => {
              if (this.props.componentDidFetch) {
                return this.props.componentDidFetch(result);
              }
              return Promise.resolve();
            }));
          }
          if (this.props.componentDidFetch) {
            return this.props.componentDidFetch(result);
          }
          return Promise.resolve();
        });
      } catch (e) {
        console.error(e);
        return Promise.reject(e);
      }
    }

    fetchData = (promises = []) => {
      let promise = null;
      if (promises instanceof Array) promise = Promise.all(promises);
      else promise = promises;
      const component = this;
      return Promise.race([promise, new Promise((resolve, reject) => {
        // eslint-disable-next-line no-underscore-dangle
        const timeout = conf.timeout || LoadingHOCComponent.__conf__.timeout || 5000;
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, timeout);
      })]).then(ps => ps, fail => new Promise((r, j) => {
        component.setState({
          __loading__: 'fail',
        }, () => j(fail));
      }));
    }

    render() {
      const {
        renderFail: fail,
        renderLoading: loading,
      // eslint-disable-next-line no-underscore-dangle
      } = LoadingHOCComponent.__conf__;
      const { __loading__ } = this.state;
      switch (__loading__) {
        case 'fail':
          return fail();
        case 'done':
          return super.render();
        case 'loading':
        default:
          return loading();
      }
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  LoadingHOCComponent.__conf__ = {
    renderFail,
    renderLoading,
    timeout: 5000,
    ...conf,
  };
  return LoadingHOCComponent;
};

export default LoadingHOC;
