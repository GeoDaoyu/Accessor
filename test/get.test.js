import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor.js";

describe("#get()", () => {
  it("should return undefined when the property in the path does not exist", function () {
    const view = new Accessor();
    expect(view.zoom).toBe(undefined);
  });

  it("should return 4 when the property is set to 4", function () {
    const view = new Accessor();
    view.zoom = 4;
    expect(view.zoom).toBe(4);
  });

  it("deep path:should return undefined when the property in the path does not exist", function () {
    const view = new Accessor();
    expect(view.map?.basemap).toBe(undefined);
  });

  it("should return the property in the deep path", function () {
    const view = new Accessor({
      map: new Accessor({
        basemap: new Accessor({
          title: "streets-vector",
        }),
      }),
    });
    expect(view.map.basemap.title).toBe("streets-vector");
  });
});
