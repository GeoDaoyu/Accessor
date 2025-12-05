type ReactiveWatchCallback = (newValue: any, oldValue: any) => void;
type ReactiveWatchExpression = () => any;

export default {
  watch(getValue: ReactiveWatchExpression, callback: ReactiveWatchCallback) {},
};
