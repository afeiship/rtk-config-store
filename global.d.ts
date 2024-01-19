type Payload = Record<string, any>;

interface NxStatic {
  $patch: ((type: string, payload?: Payload) => any) & (target: { type: string; payload?: Payload }) => any;
  $use: ((path: any, defaults?) => any) | Function;
  $get: (path: string, defaults?) => any;
  store: import('@reduxjs/toolkit/dist/configureStore').ToolkitStore;
}
