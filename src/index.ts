import { configureStore, createSlice } from '@reduxjs/toolkit';
import nx from '@jswork/next';
import { useSelector } from 'react-redux';
import reduxWatch from 'redux-watch';

type RtKConfigStoreOptions = {
  store: Record<string, any>;
  reducer?: Record<string, any>;
} & Omit<Parameters<typeof configureStore>[0], 'reducer'>;

const initRtk = (store) => {
  const { dispatch } = store;

  nx.set(nx, 'store', store);

  nx.set(nx, '$patch', (...args) => {
    if (!args.length) return;
    if (typeof args[0] === 'object') return dispatch(args[0]);
    const [type, payload] = args;
    return dispatch({ type, payload });
  });

  nx.set(nx, '$use', (path: any, defaults?) => {
    return useSelector((state) => nx.get(state, path, defaults));
  });

  nx.set(nx, '$get', (path: string, defaults?) => {
    const rootState = store.getState();
    return nx.get(rootState, path, defaults);
  });

  nx.$createSlice = createSlice;
};

const RtkConfigStore = (inOptions: RtKConfigStoreOptions) => {
  const { store, reducer, ...restOptions } = inOptions;
  const reducers: Record<string, any> = {};
  const watches: Record<string, any> = {};

  Object.keys(store).forEach((key) => {
    const value = store[key];
    const watchKey = `${value.name}@watch`;
    reducers[value.name] = value.reducer;
    watches[watchKey] = value.watch || {};
  });

  const computedReducers = { ...reducers, ...reducer };
  const rootStore = configureStore({ reducer: computedReducers, ...restOptions });

  initRtk(rootStore);

  // subscribe watch:
  nx.forIn(watches, (key, watchObj) => {
    nx.forIn(watchObj, (path, handler) => {
      const w = watch(rootStore.getState, path);
      store.subscribe(w(handler));
    });
  });

  return rootStore;
};

export default RtkConfigStore;
