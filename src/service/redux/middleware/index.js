// eslint-disable-next-line import/prefer-default-export
export const logger = process.env.NODE_ENV === 'production' ? () => next => action => next(action)
  : store => next => (action) => {
    console.group(action.type);
    console.debug('dispatching', action);
    const result = next(action);
    console.debug('next state', store.getState());
    console.groupEnd(action.type);
    return result;
  };
