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
        debugger;
        if (value) {
          resolve(value);
          handle.stop();
        }
      });
    });
  },
};
