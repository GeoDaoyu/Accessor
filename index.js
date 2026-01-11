import Accessor from "./src/Accessor";
import reactiveUtils from "./src/reactiveUtils";

const map = new Accessor({
  allLayers: [],
});
const layer = new Accessor({ id: 0 });
reactiveUtils
  .once(() => map?.allLayers?.length > 2)
  .then((value) => {
    console.log(value);
  });
map.allLayers.push(layer);
map.allLayers.push(layer);
map.allLayers.push(layer);
map.allLayers.push(layer);
