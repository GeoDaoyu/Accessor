import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor";
import reactiveUtils from "../src/reactiveUtils";

describe("#once()", () => {
  it("observe the first time a property equals a specific string value", () => {
    const featureLayer = new Accessor({
      loadStatus: "not-loaded",
    });
    reactiveUtils
      .once(() => featureLayer.loadStatus === "loaded")
      .then((value) => {
        expect(value).toBe(true);
      });
    featureLayer.loadStatus = "loaded";
  });

  it("use a comparison operator to observe a first time difference in numerical values", () => {
    const view = new Accessor({
      zoom: 4,
    });
    reactiveUtils
      .once(() => view.zoom > 10)
      .then((value) => {
        expect(value).toBe(true);
      });
    view.zoom = 5;
    view.zoom = 12;
  });

  it("observe the change only once", async () => {
    const view = new Accessor({
      zoom: 4,
    });
    let count = 0;
    reactiveUtils
      .once(() => view.zoom > 10)
      .then(() => {
        count++;
        expect(count).toBe(1);
      });
    view.zoom = 5;
    view.zoom = 12;
    view.zoom = 14;
  });
});
