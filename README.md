# Accessor

Class: `Accessor`

Accessor is an abstract class that facilitates the access to instance properties as well as a mechanism to watch for property changes. Every sub-class of Accessor defines properties that are directly accessible or by using the **get()** and **set()** methods. It is possible to watch for a property changes by using the **watch()** method.

## Installation

``` shell
npm install @geodaoyu/accessor
```

## Property Overview

| Name          | Type                                                         | Summary                | Class    |
| ------------- | ------------------------------------------------------------ | ---------------------- | -------- |
| declaredClass | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | The name of the class. | Accessor |

### Property Details

<table><tr><td bgcolor=#ddd><b>declaredClass</b> <span>String</span> <span>readonly</span></td></tr></table>

The name of the class.

## Method Overview

| Name    | Return Type | Summary                                       | Class    |
| ------- | ----------- | --------------------------------------------- | -------- |
| get()   | *           | Gets the value of a property.                 | Accessor |
| set()   | *           | Sets the value of a property.                 | Accessor |
| watch() | WatchHandle | Watches for property changes on the instance. | Accessor |

### Method Details

<table><tr><td bgcolor=#ddd><b>get(path){*}</b></td></tr></table>

Gets the value of a property.

The name of the property can refer to a property in the instance. 

```javascript
view.get("scale"); 
```

It can also be a path to a property deeper in the instance. `get()` returns `undefined` if a property in the path doesn't exist.

```javascript
var title = map.get("basemap.title");

// equivalent of
var title = map.basemap && map.basemap.title || undefined;
```

Parameter:

| **path**                         | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| -------------------------------- | ------------------------------------------------------------ |
| The path of the property to get. |                                                              |

Returns:

| Type | Description           |
| ---- | --------------------- |
| *    | The property's value. |

<table><tr><td bgcolor=#ddd><b>set(path, value){*}</b></td></tr></table>

Sets the value of a property.

Call `set()` with a property name and a value to change the value of the property.

``` javascript
// setting the basemap of the map
map.set("basemap", "topo-vector");
// is equivalent to
map.basemap = "topo-vector";

// currying set
var updateViewScale = view.set.bind(view, "scale");
updateViewScale(5000);
```

`set()` can be called with the path to a property and a value. The property is not set if a property in the path doesn't exist.

``` javascript
// updating the title of the basemap
map.set("basemap.title", "World Topographic Map");

// is equivalent to
if (map.basemap != null) {
  map.basemap.title = "World Topographic Map";
}
```

An object with key-value pairs may be passed into `set()` to update multiple properties at once.

```javascript
// setting a viewpoint on the view
view.set({
  center: [-4.4861, 48.3904],
  scale: 5000
});

// currying set
var updateView = view.set.bind(view);

updateView({
  center: [-4.4861, 48.3904],
  scale: 5000
});
```

 Parameters:

| **path**                                                     | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The path to the property to set, or an object of key-value pairs. |                                                              |
| **value**                                                    | *                                                            |
| *The new value to set on the property.                       |                                                              |

Returns:

| Type | Description   |
| ---- | ------------- |
| *    | The instance. |

<table><tr><td bgcolor=#ddd><b>watch(path, callback){WatchHandle}</b></td></tr></table>

Watches for property changes on the instance.

Watching for property changes is essential for tracking changes on objects. To start watching for changes on a property, call `watch()` with the property name and a callback function that will execute each time the property changes.

``` javascript
var handle = mapview.watch("scale", function(newValue, oldValue, propertyName, target) {
  console.log(propertyName + " changed from " + oldValue + " to " + newValue);
})
```

To stop watching for changes, call the `remove()` method on the object that `watch()` returns.

``` javascript
handle.remove();
```

It is important to store the resulting objects from `watch()` to properly clean up the references.

```javascript
var viewHandles = [];
function setView(view) {
  // remove the handles for the current view.
  viewHandles.forEach(function(handle) {
    handle.remove();
  });
  viewHandles.length = 0;

  this.view = view;

  // watch for properties on the newly set view.
  if (view) {
    viewHandles.push(
      view.watch("scale", scaleWatcher);
    );
  }
}

setView(mapView);
setView(null);
```

Like `get()` and `set()`, it is possible to watch for a property deep in the object hierarchy by passing a path. If a property in the path doesn't exist the watch callback is called with `undefined`.

``` javascript
var view = new SceneView({
  map: new Map({
    basemap: "streets-vector"
  })
});

view.watch("map.basemap.title", function(newValue, oldValue) {
  console.log("basemap's title changed from " + oldValue + " to " + newValue);
});

view.map.basemap = "topo-vector";
// output: "basemap's title changed from Streets to Topographic"

view.map = null;
// output: "basemap's title changed from Topographic to undefined"
```

Pass a comma delimited list of property paths, or an array of property paths, to watch multiple properties with the same callback. Use the third parameter of the callback call to determine what property changed.

``` javascript
view.watch("center, scale, rotation", function(newValue, oldValue, propertyName) {
  console.log(propertyName + " changed");
});

// equivalent of
view.watch(["center", "scale", "rotation"], function(newValue, oldValue, propertyName) {
  console.log(propertyName + " changed");
});

// equivalent of
var callback = function(newValue, oldValue, propertyName) {
  console.log(propertyName + " changed");
}
view.watch("center", callback);
view.watch("scale", callback);
view.watch("rotation", callback);
```

`Accessor` doesn't call the watch callbacks for a property immediately after its value changes. Instead, when a property's value changes and if that property is watched, `Accessor` schedules a notification which is then processed at a later time. Properties that change frequently like `view.scale` can be watched without having to throttle the callback.

``` javascript
// Divides the view.scale three times
view.watch("scale", function(newValue, oldValue) {
  console.log("view's scale changed from " + oldValue + " to " + newValue);
});
console.log("current view scale: " + view.scale);
view.scale = view.scale / 2;
view.scale = view.scale / 2;
view.scale = view.scale / 2;
console.log("current view scale: " + view.scale);

// output the following:
// current view scale: 36978595.474472
// current view scale: 4622324.434309
// view's scale changed from 36978595.474472 to 4622324.434309
```

Parameters:

| **path**                                                     | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| String[] |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The property or properties to watch. Multiple properties can be specified as a comma-separated list. |                                                              |
| **callback**                                                 | watchCallback                                                |
| The callback to execute when the property value has changed. |                                                              |

Returns:

| Type        | Description    |
| ----------- | -------------- |
| WatchHandle | A watch handle |

## Type Definitions

<table><tr><td bgcolor=#ddd><b>watchCallback(newValue, oldValue, propertyName, target)</b></td></tr></table>

Callback to be called when a watched property changes.

Parameters:

| **newValue**                                      | *                                                            |
| ------------------------------------------------- | ------------------------------------------------------------ |
| The new value of the watched property.            |                                                              |
| **oldValue**                                      | *                                                            |
| The old value of the watched property.            |                                                              |
| **propertyName**                                  | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| The property name.                                |                                                              |
| **target**                                        | Accessor                                                     |
| The object containing the property being watched. |                                                              |

<table><tr><td bgcolor=#ddd><b>WatchHandle</b> <span>Object</span></td></tr></table>

Represents a watch created when an object invokes **watch()**.

Property:

| **remove**                | [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) |
| ------------------------- | ------------------------------------------------------------ |
| Removes the watch handle. |                                                              |

Example:

``` javascript
var handle = map.watch('basemap', function(newVal){
  // Each time the value of map.basemap changes, it is logged in the console
  console.log("new basemap: ", newVal);
});

// When remove() is called on the watch handle, the map no longer watches for changes to basemap
handle.remove();
```