import { configureStore, createSlice } from '@reduxjs/toolkit';
import nx from '@jswork/next';
import { useSelector } from 'react-redux';
import reduxWatch from 'redux-watch';

type RtKConfigStoreOptions = {
  store: Record<string, any>;
} & Parameters<typeof configureStore>[0];

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

  nx.$createSlice = (inOptions) => {
    const { watch, ...restOptions } = inOptions;
    const watches = watch || {};

    Object.keys(watches).forEach((key) => {
      const w = reduxWatch(store.getState, key);
      const watchFn = watches[key];
      store.subscribe(w((newVal, oldVal, objectPath) => watchFn(newVal, oldVal, objectPath)));
    });

    return createSlice(restOptions as any);
  };
};

const RtkConfigStore = (inOptions: RtKConfigStoreOptions) => {
  const { store, reducer, ...restOptions } = inOptions;
  const reducers: Record<string, any> = {};

  Object.keys(store).forEach((key) => {
    const value = store[key];
    reducers[value.name] = value.reducer;
  });

  const computedReducers = { ...reducers, ...reducer };

  const rootStore = configureStore({ reducer: computedReducers, ...restOptions });

  initRtk(rootStore);

  return rootStore;
};

export default RtkConfigStore;
