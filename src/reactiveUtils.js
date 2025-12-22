import { createEffect } from "./Signal";

const equality = (a, b) => a === b;

export default {
  watch(getValue, callback) {
    const oldValue = getValue();
    createEffect(() => {
      if (!equality(getValue(), oldValue)) {
        callback(getValue(), oldValue);
      }
    });
  },
};
