import { shallowReactive } from "@vue/reactivity";

class Accessor {
  constructor(properties) {
    properties && Object.assign(this, properties);
    return shallowReactive(this);
  }

  set(path, value) {
    const setter = (key, value) => {
      this[key] = value;
    };
    const setByString = (str, value) => {
      const [key, ...rest] = str.split(".");
      if (rest.length === 0) {
        setter(key, value);
      } else {
        this[key]?.set(rest.join("."), value);
      }
    };
    const setByObject = (obj) => {
      Object.entries(obj).forEach(([key, value]) => setter(key, value));
    };
    if (typeof path === "string") {
      setByString(path, value);
    } else if (typeof path === "object") {
      setByObject(path);
    }
    return this;
  }
}

export default Accessor;
