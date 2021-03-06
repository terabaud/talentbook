import { Action } from '../store/app.actions';

export function combineReducers(reducers: Record<string, Function>) {
  return (state: any, action: Action<any>) => {
    const newState: Record<string, object> = {};
    for (const key in reducers) {
      newState[key] = reducers[key](state[key], action);
    }
    return newState;
  };
}
