import { Store, createStore, applyMiddleware, compose, Action } from 'redux';
import thunk from 'redux-thunk';
import { RootState, rootReducer } from './reducers';

const configureStore = (initialState: any): Store<RootState, Action> => {
  // Add support for Redux dev tools.
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__ || compose;

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk)));
};

export { configureStore };
