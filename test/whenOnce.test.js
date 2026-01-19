import { describe, it, expect } from "vitest";
import Accessor from "../src/Accessor";
import reactiveUtils from "../src/reactiveUtils";

describe("#whenOnce()", () => {
  it("check for the first time a property becomes truthy", async () => {
    const view = new Accessor({
      popup: new Accessor({
        visible: false,
      }),
    });

    const promise = reactiveUtils.whenOnce(() => view.popup?.visible);

    setTimeout(() => {
      view.popup.visible = true;
    }, 10);

    const result = await promise;
    expect(result).toBe(true);
  });
});
