import React from 'react';
import { Skeleton } from 'antd';

const renderLoading = () => <Skeleton active />;

const renderFail = () => <div>Loading Fail</div>;

/**
 * Loading的通用组件
 * 必须作为ReactComponent的直接高阶函数
 */
const LoadingHOC = (WrapperComponent, conf) => {
  class LoadingHOCComponent extends WrapperComponent {
    constructor(props, context, updater) {
      super(props, context, updater);
      this.state = {
        status: 'loading',
      };
      try {
        const ps = super.componentFetchData();
        const didFetch = super.componentDidFetch;
        this.fetchData(ps).then(didFetch.bind(this));
      } catch (e) {
        console.error(e);
      }
    }

    fetchData = (promises = []) => {
      let promise = null;
      if (promises instanceof Promise) promise = promises;
      else if (promises instanceof Array) promise = Promise.all(promises);

      return Promise.race([promise, new Promise((resolve, reject) => {
        // eslint-disable-next-line no-underscore-dangle
        const { timeout = 5000 } = LoadingHOCComponent.__conf__;
        setTimeout(reject, timeout);
      })]).then(ps => new Promise((r) => {
        this.setState({
          status: 'done',
        }, () => r(ps));
      }), fail => new Promise((r, j) => {
        this.setState({
          status: 'fail',
        }, () => j(fail));
      }));
    }

    render() {
      const {
        renderFail: fail,
        renderLoading: loading,
      // eslint-disable-next-line no-underscore-dangle
      } = LoadingHOCComponent.__conf__;
      const { status } = this.state;
      switch (status) {
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
