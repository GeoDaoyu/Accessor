import { ref, watch, reactive } from "@vue/reactivity";
import Accessor from "./src/Accessor";

const view = new Accessor({ zoom: 1 });

view.zoom = 2;
watch(
  () => view.zoom,
  (newValue, oldValue) => {
    console.log(newValue, oldValue);
  },
);
view.zoom = 3;
