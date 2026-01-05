import { watch } from "@vue/reactivity";

export default {
  watch: (...args) => {
    const handle = watch(...args);
    return {
      ...handle,
      remove: handle.stop,
    };
  },
};
