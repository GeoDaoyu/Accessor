import { watch } from "@vue/reactivity";

export default {
  watch: (...args) => {
    const handle = watch(...args);
    return {
      ...handle,
      remove: handle.stop,
    };
  },
  once: (getValue) => {
    return new Promise((resolve) => {
      const handle = watch(getValue, (value) => {
        if (value) {
          resolve(value);
          handle.stop();
        }
      });
    });
  },
  when: (getValue, callback) => {
    const handle = watch(getValue, (value) => {
      if (getValue) {
        callback(value);
      }
    });
    return {
      ...handle,
      remove: handle.stop,
    };
  },
  whenOnce: (getValue) => {
    return new Promise((resolve) => {
      const handle = watch(getValue, (value) => {
        if (value) {
          resolve(value);
          handle.stop();
        }
      });
    });
  },
};
