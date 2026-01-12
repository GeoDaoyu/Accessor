import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor";
import reactiveUtils from "../src/reactiveUtils";

describe("#when()", () => {
  it("observe when a boolean property becomes not truthy", () => {
    const layerView = new Accessor({
      updating: true,
    });
    reactiveUtils.when(
      () => !layerView.updating,
      (value) => {
        expect(value).toBe(true);
      },
    );
    layerView.updating = false;
  });
});
