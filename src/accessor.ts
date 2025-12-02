type WatchCallback = (
  newValue: any,
  oldValue: any,
  propertyName: string,
  target: Accessor,
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

class Accessor {
  declaredClass: string;
  private _handles: Set<Handle>;

  constructor(props: object = {}) {
    // 为当前实例创建一个代理
    const proxy = new Proxy(this, {
      set: (target, key, value, receiver) => {
        if (key !== "_handles" && target._handles) {
          const oldValue = target[key];
          target._handles.forEach((handle) => {
            if (handle.path === key) {
              handle.callback(value, oldValue, key, target);
            }
          });
        }
        return Reflect.set(target, key, value, receiver);
      },
    });

    // 初始化属性
    for (let prop in props) {
      proxy[prop] = props[prop];
    }
    proxy.declaredClass = "Accessor";
    proxy._handles = new Set();

    return proxy;
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
      const dotIndex = item.indexOf(".");
      const handle =
        dotIndex !== -1
          ? this[item.slice(0, dotIndex)].watch(
              item.slice(dotIndex + 1),
              callback,
            )
          : { path: item, callback };

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

export default Accessor;
