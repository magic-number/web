import { createStore, combineReducers, applyMiddleware } from 'redux'
import { initialState } from './action'
import reducer from './reducer'
import { logger } from './middleware'

export const store = createStore(combineReducers(reducer), initialState, applyMiddleware(logger))
