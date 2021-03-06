import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  Dispatch,
} from 'react';
import { isDarkTheme } from '../helpers/preferences';

import { Action } from './app.actions';
import { appReducer } from './app.reducer';
import { AppState, initialAppState } from './app.state';

export type AppContextType = {
  state: AppState;
  dispatch: Dispatch<Action<any>>;
};

const MyAppContext = createContext<AppContextType>({
  state: initialAppState,
  dispatch: () => {},
});

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialAppState,
    darkMode: isDarkTheme(),
  });
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <MyAppContext.Provider value={value}>{children}</MyAppContext.Provider>
  );
};

export const useAppStore = () => {
  return useContext(MyAppContext);
};
