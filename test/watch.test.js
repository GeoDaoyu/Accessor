import Accessor from "../dist/index.js";
import assert from "assert";

describe("#watch()", function () {
  it("watch property change", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor();
    view.zoom = 4;
    view.watch("zoom", callback);
    view.zoom = 5;
    assert.deepStrictEqual(result, [5, 4, "zoom", view]);
  });
  /**
   * 深层属性的变更的监听
   * 注意,此时callback的target是指向 拥有这个属性的类,而不是最外层的类
   */
  it("watch deep path property change", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor({
      map: new Accessor({
        basemap: new Accessor({
          title: "streets-vector",
        }),
      }),
    });
    view.watch("map.basemap.title", callback);
    view.map.basemap.title = "topo-vector";
    assert.deepStrictEqual(result, [
      "topo-vector",
      "streets-vector",
      "title",
      view.map.basemap,
    ]);
  });
  /**
   * 一个callback监听多个属性, 字符串形式
   */
  it("watch multiple propertys change in string", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor({
      zoom: 12,
      scale: 144447.638572,
    });
    view.watch("zoom, scale", callback);
    view.zoom = 11;
    view.scale = 288895.277144;
    assert.deepStrictEqual(result, [
      11,
      12,
      "zoom",
      view,
      288895.277144,
      144447.638572,
      "scale",
      view,
    ]);
  });
  /**
   * 一个callback监听多个属性, 数组形式
   */
  it("watch multiple propertys change in string array", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor({
      zoom: 12,
      scale: 144447.638572,
    });
    view.watch(["zoom", "scale"], callback);
    view.zoom = 11;
    view.scale = 288895.277144;
    assert.deepStrictEqual(result, [
      11,
      12,
      "zoom",
      view,
      288895.277144,
      144447.638572,
      "scale",
      view,
    ]);
  });
  /**
   * 调用remove方法移除handle,callback将不执行
   */
  it("remove watch handle", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor();
    view.zoom = 4;
    const handle = view.watch("zoom", callback);
    handle.remove();
    view.zoom = 5;
    assert.deepStrictEqual(result, []);
  });
  /**
   * 只在注册的属性变更后执行callback
   */
  it("only watch registered property", function () {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    const view = new Accessor();
    view.zoom = 4;
    view.watch("scale", callback);
    view.zoom = 5;
    assert.deepStrictEqual(result, []);
  });
  /**
   * 子类上的方法也可以被监听
   */
  it("watch subclass member", function () {
    class View extends Accessor {
      constructor() {
        super();
        this.zoom = 3;
      }
      setZoom = (value) => {
        this.zoom = value;
      };
    }

    const view = new View();
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    view.zoom = 4;
    view.watch("zoom", callback);
    view.setZoom(5);

    assert.deepStrictEqual(result, [5, 4, "zoom", view]);
  });
});
