type Payload = Record<string, any>;
type ActionObject = {
  type: string;
  payload?: any;
};

type ActionFunction = {
  (type: string, payload?: any): ActionObject;
  (action: ActionObject): ActionObject;
};

interface NxStatic {
  $patch: ActionFunction;
  $use: (path: any, defaults?) => any;
  $get: (path: string, defaults?) => any;
  store: import('@reduxjs/toolkit/dist/configureStore').ToolkitStore;
  $createSlice: (inOptions: any) => any;
}
