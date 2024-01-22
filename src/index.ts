import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { Slice } from '@reduxjs/toolkit';
import nx from '@jswork/next';
import { useSelector } from 'react-redux';
import reduxWatch from 'redux-watch';
import fde from 'fast-deep-equal';

const getComputed = (inModules: Record<string, any>, inPath: string) => {
  const paths = inPath.split('.');
  paths.splice(1, 0, 'selectors');
  return nx.get(inModules, paths.join('.'));
};

nx.$createSlice = (inOptions: any) => {
  const { name, watch, ...restOptions } = inOptions;
  const slice = createSlice({ name, ...restOptions }) as any;
  slice.__watch__ = watch;
  slice.__getters__ = watch;
  return slice as Slice
};

type RtKConfigStoreOptions = {
  store: Record<string, any>;
  reducer?: Record<string, any>;
} & Omit<Parameters<typeof configureStore>[0], 'reducer'>;

const initRtk = (store) => {
  const { dispatch } = store;

  nx.set(nx, '$store', store);

  nx.set(nx, '$patch', (...args) => {
    if (!args.length) return;
    if (typeof args[0] === 'object') return dispatch(args[0]);
    const [type, payload] = args;
    return dispatch({ type, payload });
  });

  nx.set(nx, '$get', (path?: string, defaults?) => {
    const state = store.getState();
    if (!path) return state;
    const computed = getComputed(nx.$slice, path);
    return typeof computed === 'function' ? computed(state) : nx.get(state, path, defaults);
  });

  nx.set(nx, '$use', (path: any, defaults?) => {
    const computed = getComputed(nx.$slice, path);
    const strSelector = (state) => nx.get(state, path, defaults)
    const selector = typeof path === 'function' ? path : (
      typeof computed === 'function' ? computed : strSelector
    );
    return useSelector(selector);
  });
};

const RtkConfigStore = (inOptions: RtKConfigStoreOptions) => {
  const { store, reducer, ...restOptions } = inOptions;
  const reducers: Record<string, any> = {};
  const watches: Record<string, any> = {};

  nx.$slice = store;

  Object.keys(store).forEach((key) => {
    const value = store[key];
    const name = value.name;
    reducers[name] = value.reducer;
    // @ts-ignore
    watches[name] = value.__watch__ || {};
    // @ts-ignore
    delete value.__watch__;
  });

  const computedReducers = { ...reducers, ...reducer };
  const rootStore = configureStore({ reducer: computedReducers, ...restOptions });

  initRtk(rootStore);

  // subscribe watch:
  nx.forIn(watches, (name, watchObj) => {
    nx.forIn(watchObj, (path, handler) => {
      const w = reduxWatch(rootStore.getState, `${name}.${path}`, fde);
      rootStore.subscribe(w(handler));
    });
  });

  return rootStore;
};

export default RtkConfigStore;
