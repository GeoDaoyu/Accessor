import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor.js";

describe("#constructor()", () => {
  it('typeof accessor should be "object"', () => {
    const accessor = new Accessor();
    expect(typeof accessor).toBe("object");
  });
  /**
   * 可以通过对象的形式给类赋初值
   */
  it("accessor's props can be an object", () => {
    const view = new Accessor({
      zoom: 4,
    });
    expect(view.zoom).toBe(4);
  });
  /**
   * 子类可以继承Accessor
   */
  it("subclass can extend from Accessor", () => {
    class View extends Accessor {
      constructor() {
        super();
        this.declaredClass = "View";
      }
    }
    const view = new View();
    expect(view instanceof Accessor).toBe(true);
  });
});
