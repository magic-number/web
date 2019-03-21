import { ActionMap } from './action';

const reducers = {};

const createReducer = (type, val = null) => (state, action) => {
  if (action.type === type) {
    if (state !== action.payload) {
      return action.payload;
    }
    return state;
  }
  if (state !== undefined && state !== val) return state;
  return val;
};

Object.keys(ActionMap).forEach((k) => {
  reducers[k] = createReducer(k);
});


export default reducers;
