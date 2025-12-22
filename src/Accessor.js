import { createSignal } from "./Signal";

class Accessor {
  signals = new Map();
  constructor(props = {}) {
    for (const [key, value] of Object.entries(props)) {
      const [getter, setter] = createSignal(value);
      this.signals.set(key, [getter, setter]);
    }

    const proxy = new Proxy(this, {
      get: (_, key) => {
        if (this.signals.has(key)) {
          const [getter] = this.signals.get(key);
          return getter();
        }
        return undefined;
      },

      set: (_, key, value) => {
        if (this.signals.has(key)) {
          const [_, setter] = this.signals.get(key);
          setter(value);
        } else {
          const [getter, setter] = createSignal(value);
          this.signals.set(key, [getter, setter]);
        }
        return true;
      },
    });

    return proxy;
  }
}

export default Accessor;
