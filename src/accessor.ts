type WatchCallback = (
  newValue: any,
  oldValue: any,
  propertyName: string,
  target: Accessor
) => void;

interface WatchHandle extends Object {
  /**
   * Removes the watch handle.
   */
  remove(): void;
}

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
  declaredClass: string;
  private _handles: Set<any>;

  constructor(props: object) {
    for (let prop in props) {
      this[prop] = props[prop];
    }
    this.declaredClass = "Accessor";
    this._handles = new Set();
  }
  get(path: string): any {
    const dotIndex = path.indexOf(".");
    if (dotIndex !== -1) {
      const key = path.slice(0, dotIndex);
      const value = path.slice(dotIndex + 1);
      return this[key] && this[key].get(value);
    }
    return this[path];
  }
  set(path: string | object, value: any): this {
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
    } else {
      for (const key in path) {
        this.set(key, path[key]);
      }
    }

    return this;
  }
  watch(path: string, callback: WatchCallback): WatchHandle {
    const dotIndex = path.indexOf(".");
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
    const watchHandle = {
      remove: () => this._handles.delete(handle),
    };
    return watchHandle;
  }
}

export default observe(Accessor);
