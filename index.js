import reactiveUtils from "./src/reactiveUtils.js";
import Accessor from "./src/Accessor.js";

const o = new Accessor({ count: 5 });
o.count = 0;
reactiveUtils.watch(
  () => o.count,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
  }
);
o.count = 7;
