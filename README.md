# rtk-config-store
> Redux toolkit config store with next.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/rtk-config-store
```

## usage
> store.ts
```ts
import { scanWebpack } from '@jswork/scan-modules';
import RtkConfigStore from '@jswork/rtk-config-store';

// when webpack
const context = require.context('./modules', true, /\.ts$/);
const stores = scanWebpack(context, { modules: '/modules/' });
export const store = RtkConfigStore({ store: stores, preloadedState: {}, reducer: {} });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

> app.ts
```ts
import { Provider } from 'react-redux';
import { store } from '@/shared/stores/root';

interface IReduxProviderProps extends React.PropsWithChildren {}

export default function (props: IReduxProviderProps) {
  const { children } = props;
  return <Provider store={store}>{children}</Provider>;
}
```

## types
```ts
/// <reference types="@jswork/rtk-config-store/global.d.ts" />
```

## license
Code released under [the MIT license](https://github.com/afeiship/rtk-config-store/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/rtk-config-store
[version-url]: https://npmjs.org/package/@jswork/rtk-config-store

[license-image]: https://img.shields.io/npm/l/@jswork/rtk-config-store
[license-url]: https://github.com/afeiship/rtk-config-store/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/rtk-config-store
[size-url]: https://github.com/afeiship/rtk-config-store/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/rtk-config-store
[download-url]: https://www.npmjs.com/package/@jswork/rtk-config-store
