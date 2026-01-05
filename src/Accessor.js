import { shallowReactive } from "@vue/reactivity";

class Accessor {
  constructor(properties) {
    properties && Object.assign(this, properties);
    return shallowReactive(this);
  }

  set(path, value) {
    if (typeof path === "string") {
      const dotIndex = path.indexOf(".");
      if (dotIndex !== -1) {
        const key = path.slice(0, dotIndex);
        const childPath = path.slice(dotIndex + 1);
        if (this[key]) {
          this[key].set(childPath, value);
        }
      } else {
        this[path] = value;
      }
    }
    if (typeof path === "object") {
      for (const key in path) {
        this.set(key, path[key]);
      }
    }
    return this;
  }
}

export default Accessor;
