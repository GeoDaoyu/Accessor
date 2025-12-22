import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor";
import reactiveUtils from "../src/reactiveUtils";

describe("#watch()", () => {
  it("watch property change", () => {
    const result = [];
    const callback = (newValue, oldValue) => {
      result.push(newValue, oldValue);
    };
    const view = new Accessor();
    view.zoom = 4;
    reactiveUtils.watch(() => view.zoom, callback);
    view.zoom = 5;
    expect(result).toEqual([5, 4]);
  });
});
