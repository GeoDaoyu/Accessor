# Accessor

## Overview

Accessor is an abstract class that facilitates access to instance properties as well as a mechanism to watch for property changes. Every sub-class of Accessor defines properties that are directly accessible or by using the **get()** and **set()** methods. It is possible to watch for property changes by using the **watch()** method.

## Property Overview

| Name          | Type | Summary | Class |
| ------------- | ---- | ------- | ----- |
| declaredClass | String | The name of the class. | Accessor |

### Property Details

**declaredClass** (String, readonly)  
The name of the class.

## Method Overview

| Name  | Return Type | Summary | Class |
| ----- | ----------- | ------- | ----- |
| set() | *           | Sets the value of a property. | Accessor |
| watch() | WatchHandle | Tracks any property accessed in a `getValue` function and calls the callback when any of them change. | Accessor |

### Method Details

#### set(path, value) {*}

Sets the value of a property.

```javascript
// setting the basemap of the map
map.set("basemap", "topo-vector");
// is equivalent to
map.basemap = "topo-vector";

// currying set
const updateViewScale = view.set.bind(view, "scale");
updateViewScale(5000);
```

```javascript
// updating the title of the basemap
map.set("basemap.title", "World Topographic Map");

// is equivalent to
if (map.basemap != null) {
  map.basemap.title = "World Topographic Map";
}
```

```javascript
// setting a viewpoint on the view
view.set({
  center: [-4.4861, 48.3904],
  scale: 5000
});

// currying set
const updateView = view.set.bind(view);
updateView({
  center: [-4.4861, 48.3904],
  scale: 5000
});
```

Parameters:
- **path**: The path to the property to set, or an object of key-value pairs.
- **value**: The new value to set on the property.

Returns: The instance (`*`).

#### watch(getValue, callback, options?)

Tracks any properties accessed in the `getValue` function and calls the callback when any of them change.

Parameters:
- **getValue**: Function used to get the current value. All accessed properties will be tracked.
- **callback**: The function to call when there are changes.
- **options**: Options used to configure how the tracking happens and how the callback is called.

Returns: WatchHandle.

Example:
```javascript
const handle = view.watch(() => map.basemap, (newVal) => {
  console.log("new basemap: ", newVal);
});

// Remove the watch when done
handle.remove();
```

## Reactive Behavior

The design of this library is inspired by reactive patterns similar to those used in ArcGIS, providing mechanisms to watch for property changes. Only `watch()` is supported. Other reactive utility methods (such as `on`, `once`, or `when`) are not part of this library.
