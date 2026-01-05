import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor";
import reactiveUtils from "../src/reactiveUtils";

describe("#watch()", () => {
  it("watch property change", () => {
    const callback = (newValue, oldValue) => {
      expect(newValue).toBe(5);
      expect(oldValue).toBe(4);
    };
    const view = new Accessor();
    view.zoom = 4;
    reactiveUtils.watch(() => view.zoom, callback);
    view.zoom = 5;
  });

  it("watch deep path property change", function () {
    const callback = (newValue, oldValue) => {
      expect(newValue).toBe("topo-vector");
      expect(oldValue).toBe("streets-vector");
    };
    const view = new Accessor({
      map: new Accessor({
        basemap: new Accessor({
          title: "streets-vector",
        }),
      }),
    });
    reactiveUtils.watch(() => view.map.basemap.title, callback);
    view.map.basemap.title = "topo-vector";
  });

  it("watch multiple propertys change in string array", function () {
    const result = [];
    const callback = (newValue, oldValue) => {
      result.push(...newValue, ...oldValue);
    };
    const view = new Accessor({
      zoom: 12,
      stationary: false,
    });
    reactiveUtils.watch(() => [view.zoom, view.stationary], callback);
    view.zoom = 11;
    view.stationary = true;
    expect(result).toEqual([11, false, 12, false, 11, true, 11, false]);
  });

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
    const callback = (newValue, oldValue) => {
      expect(newValue).toBe(5);
      expect(oldValue).toBe(4);
    };
    view.zoom = 4;
    reactiveUtils.watch(() => view.zoom, callback);
    view.setZoom(5);
  });
});
