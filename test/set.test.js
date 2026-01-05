import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor.js";

describe("#set()", () => {
  it("should return 4 when the property is set to 4", () => {
    const view = new Accessor();
    view.set("zoom", 4);
    expect(view.zoom).toBe(4);
  });

  it("should return 4 when the property is 4", () => {
    const view = new Accessor();
    view.zoom = 4;
    expect(view.zoom).toBe(4);
  });

  it("deep path set property", () => {
    const map = new Accessor();
    const basemap = new Accessor();
    map.set("basemap", basemap);
    map.set("basemap.title", "World Topographic Map");
    expect(map.basemap.title).toBe("World Topographic Map");
  });

  it("deep path set property which does not exist", () => {
    const map = new Accessor();
    map.set("basemap.title", "World Topographic Map");
    expect(map.basemap?.title).toBe(undefined);
  });

  it("An object with key-value pairs can be passed into", () => {
    const view = new Accessor();
    view.set({
      zoom: 4,
      scale: 5000,
    });
    expect(view.zoom).toBe(4);
    expect(view.scale).toBe(5000);
  });

  it("An object with key-value pairs can be passed into", () => {
    const view = new Accessor();
    const updateView = view.set.bind(view);
    updateView({
      center: [-4.4861, 48.3904],
      scale: 5000,
    });
    expect(view.scale).toBe(5000);
  });
});
