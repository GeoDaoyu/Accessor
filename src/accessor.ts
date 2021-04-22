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

interface Handle {
  path: string;
  callback: Function;
}

/**
 * observe class
 * @param cls class
 * @returns Proxy
 */
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
  private _handles: Set<Handle>;

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
  watch(path: string | string[], callback: WatchCallback): WatchHandle {
    const handles = [];
    const pathArray = [];
    if (typeof path === "object") {
      pathArray.push(...path);
    }
    if (typeof path === "string") {
      if (path.includes(",")) {
        pathArray.push(...path.replace(" ", "").split(","));
      } else {
        pathArray.push(path);
      }
    }
    pathArray.forEach((item) => {
      let handle;
      const dotIndex = item.indexOf(".");
      if (dotIndex !== -1) {
        const key = item.slice(0, dotIndex);
        const value = item.slice(dotIndex + 1);
        handle = this[key].watch(value, callback);
      } else {
        handle = {
          path: item,
          callback,
        };
      }
      handles.push(handle);
      this._handles.add(handle);
    });

    const watchHandle = {
      remove: () => {
        handles.forEach((handle) => {
          this._handles.delete(handle);
        });
      },
    };
    return watchHandle;
  }
}

export default observe(Accessor);
