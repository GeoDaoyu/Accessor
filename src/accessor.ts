function observe(cls) {
  return new Proxy(cls, {
    construct(target, args) {
      const obj = new target(...args);
      return new Proxy(obj, {
        set: (target, key, value, receiver) => {
          const oldValue = target[key];
          target._handles.forEach((handle) => {
            if (handle.path === key) {
              handle.callback(value, oldValue, key, target);
            }
          });
          return Reflect.set(target, key, value, receiver);
        },
      });
    },
  });
}

class Accessor {
  public declaredClass: string;
  private _handles: Set<any>;
  constructor(props) {
    if (typeof props === 'object') {
      for (let prop in props) {
        this[prop] = props[prop];
      }
    }
    this.declaredClass = "Accessor";
    this._handles = new Set();
  }
  get(path) {
    const dotIndex = path.indexOf('.');
    if (dotIndex !== -1) {
      const key = path.slice(0, dotIndex);
      const value = path.slice(dotIndex + 1);
      return this[key] && this[key].get(value);
    }
    return this[path];
  }
  set(path, value) {
    const dotIndex = path.indexOf('.');
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
  watch(path, callback) {
    const dotIndex = path.indexOf('.');
    if (dotIndex !== -1) {
      const key = path.slice(0, dotIndex);
      const value = path.slice(dotIndex + 1);
      return this[key].watch(value, callback);
    }
    const handle = {
      path,
      callback,
    };
    this._handles.add(handle);
    return {
      remove: () => this._handles.delete(handle),
    };
  }
}

export default observe(Accessor);