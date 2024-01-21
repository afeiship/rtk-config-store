type Payload = Record<string, any>;
type createSliceArgs = Parameters<typeof createSlice>[0];
type createSliceOptions = createSliceArgs & {
  watch?: Record<string, (oldVal, newVal, objectPath) => void>;
};

interface NxStatic {
  $patch:
    | ((type: string, payload?: Payload) => any)
    | ((target: { type: string; payload?: Payload }) => any);
  $use: (path: any, defaults?) => any;
  $get: (path: string, defaults?) => any;
  store: import('@reduxjs/toolkit/dist/configureStore').ToolkitStore;
  $createSlice: (inOptions: createSliceOptions) => any;
}
