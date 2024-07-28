type ActionObject = {
  type: string;
  payload?: any;
};

type ActionFunction = {
  (type: string, payload?: any): ActionObject;
  (action: ActionObject): ActionObject;
};

interface NxStatic {
  $event: any;
  $patch: ActionFunction;
  $use: (path?: any, defaults?) => any;
  $get: (path?: string, defaults?) => any;
  $store: import('@reduxjs/toolkit/dist/configureStore').ToolkitStore;
  $slice: Record<string, any>;
  $createSlice: (options: any) => import('@reduxjs/toolkit').Slice<any, any>;
}
