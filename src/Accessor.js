import { ref, watch, reactive } from "@vue/reactivity";

class Accessor {
  constructor(properties) {
    properties && Object.assign(this, properties);
    return reactive(this);
  }
}

export default Accessor;
