import Accessor from "../dist/index.js";
import assert from "assert";
class Counter extends Accessor {
  constructor() {
    super();
    this.number = 0;
  }
  setNumber = (value) => {
    this.number = value;
  };
}

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
    const counter = new Counter();
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    };
    counter.number = 4;
    counter.watch("number", callback);
    counter.setNumber(5);

    assert.deepStrictEqual(result, [5, 4, "number", counter]);
  });

  /**
   * 子类上的方法 监听变更次数
   */
  it("watch subclass member changed times", function () {
    const counter = new Counter();
    let times = 0;
    const callback = () => {
      times++;
    };
    counter.watch("number", callback);
    counter.number = 1; // +1;
    counter.number = 1; // +1;
    counter.set("number", 2); // +1;
    counter.set("number", 2); // +1;
    counter.set({ number: 3 }); // +1;
    counter.set({ number: 3 }); // +1;
    counter.setNumber(4); // +1;
    counter.setNumber(4); // +1;

    assert.equal(times, 8);
  });
});
