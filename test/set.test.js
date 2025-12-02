import Accessor from "../dist/index.js";
import assert from "assert";

describe("#set()", function () {
  it("should return 4 when the property is set to 4", function () {
    const view = new Accessor();
    view.set("zoom", 4);
    assert.strictEqual(view.zoom, 4);
  });
  it("should return 4 when the property is 4", function () {
    const view = new Accessor();
    view.zoom = 4;
    assert.strictEqual(view.zoom, 4);
  });
  /**
   * 设置属性的属性
   */
  it("deep path set property", function () {
    const map = new Accessor();
    const basemap = new Accessor();
    map.set("basemap", basemap);
    map.set("basemap.title", "World Topographic Map");
    assert.strictEqual(map.basemap.title, "World Topographic Map");
  });
  /**
   * 设置属性的属性,当属性不存在的时候,不设置
   */
  it("deep path set property which does not exist", function () {
    const map = new Accessor();
    map.set("basemap.title", "World Topographic Map");
    assert.strictEqual(map.basemap.title, undefined);
  });
  /**
   * 可以通过对象的形式批量设置属性
   */
  it("An object with key-value pairs can be passed into", function () {
    const view = new Accessor();
    view.set({
      center: [-4.4861, 48.3904],
      scale: 5000,
    });
    assert.strictEqual(view.scale, 5000);
  });
  /**
   * 柯里化
   */
  it("An object with key-value pairs can be passed into", function () {
    const view = new Accessor();
    const updateView = view.set.bind(view);
    updateView({
      center: [-4.4861, 48.3904],
      scale: 5000,
    });
    assert.strictEqual(view.scale, 5000);
  });
});
