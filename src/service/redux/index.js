import { createStore, combineReducers, applyMiddleware } from 'redux';
import { initialState, ActionMap } from './action';
import reducer from './reducer';
import { logger } from './middleware';

const store = createStore(combineReducers(reducer), initialState, applyMiddleware(logger));

export default store;

export {
  ActionMap,
};
