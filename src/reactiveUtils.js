import { createEffect } from "./Signal";

const equality = (a, b) => a === b;

export default {
  watch(getValue, callback) {
    const oldValue = getValue();
    createEffect(() => {
      if (Array.isArray(oldValue)) {
        if (
          getValue().length === oldValue.length &&
          getValue().every((val, index) => val === oldValue[index])
        ) {
          return;
        } else {
          callback(getValue(), oldValue);
        }
      } else {
        if (!equality(getValue(), oldValue)) {
          callback(getValue(), oldValue);
        }
      }
    });
  },
};
