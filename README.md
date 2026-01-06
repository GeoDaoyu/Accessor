# Accessor

## Overview

Accessor is an abstract class that facilitates the access to instance properties as well as a mechanism to watch for property changes. Every sub-class of Accessor defines properties that are directly accessible or by using the **get()** and **set()** methods. It is possible to watch for a property changes by using the **watch()** method.

## Property Overview

| Name          | Type                                                         | Summary                | Class    |
| ------------- | ------------------------------------------------------------ | ---------------------- | -------- |
| declaredClass | **String** | The name of the class. | Accessor |

### Property Details

<table><tr><td bgcolor=#ddd><b>declaredClass</b> <span>String</span> <span>readonly</span></td></tr></table>

The name of the class.

## Method Overview

| Name  | Return Type | Summary                       | Class    |
| ----- | ----------- | ----------------------------- | -------- |
| set() | *           | Sets the value of a property. | Accessor |

### Method Details

<table><tr><td bgcolor=#ddd><b>set(path, value) {*}</b></td></tr></table>

Sets the value of a property.

Call `set()` with a property name and a value to change the value of the property.

``` javascript
// setting the basemap of the map
map.set("basemap", "topo-vector");
// is equivalent to
map.basemap = "topo-vector";

// currying set
const updateViewScale = view.set.bind(view, "scale");
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
const updateView = view.set.bind(view);

updateView({
  center: [-4.4861, 48.3904],
  scale: 5000
});
```

 Parameters:

| **path**                                                     | String | Object |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| The path to the property to set, or an object of key-value pairs. |                                                              |
| **value**                                                    | *                                                            |
| The new value to set on the property.                        |                                                              |

Returns:

| Type | Description   |
| ---- | ------------- |
| *    | The instance. |

# reactiveUtils

## Overview

`reactiveUtils` provide capabilities for observing changes to the state of the SDK's properties, and is an important part of managing your application's life-cycle. State can be observed on a variety of different data types and structures including strings, numbers, arrays, booleans, collections, and objects.

## Using reactiveUtils

`reactiveUtils` provides five methods that offer different patterns and capabilities for observing state: [on()], [once()], [watch()], [when()] and [whenOnce()].

The following is a basic example using [reactiveUtils.watch()]. It demonstrates how to track the Map component [updating] property and then send a message to the console when the property changes. This snippet uses a `getValue` function as an expression that evaluates the `updating` property, and when a change is observed the new value is passed to the callback:

```
// Basic example of watching for changes on a boolean property
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
  // getValue function
  () => viewElement.updating,
  // callback
  (updating) => {
    console.log(updating)
  });
```



### Working with collections

`reactiveUtils` can be used to observe changes within a collection, such as [Map.allLayers]. Out-of-the-box JavaScript methods such as [`.map()`] and [`.filter()`] can be used as expressions to be evaluated in the `getValue` function.

```
// Watching for changes within a collection
// whenever a new layer is added to the map
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
  () => viewElement.map.allLayers.map( layer => layer.id),
  (ids) => {
    console.log(`FeatureLayer IDs ${ids}`);
  });
```



### Working with objects

With `reactiveUtils` you can track named object properties through dot notation (e.g. `viewElement.updating`) or through bracket notation (e.g. `viewElement["updating"]`). You can also use the [optional chaining] operator (`?.`). This operator simplifies the process of verifying that properties used in the `getValue` function are not `undefined` or `null`.

```
// Watch for changes in an object using optional chaining
// whenever the map's extent changes
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
  () => viewElement?.extent?.xmin,
  (xmin) => {
    console.log(`Extent change xmin = ${xmin}`)
  });
```



### WatchHandles and Promises

The [watch()], [on()] and [when()] methods return a [WatchHandle]. Be sure to remove watch handles when they are no longer needed to avoid memory leaks.

```
// Use a WatchHandle to stop watching
const viewElement = document.querySelector("arcgis-map");
const handle = reactiveUtils.watch(
  () => viewElement?.extent?.xmin,
  (xmin) => {
    console.log(`Extent change xmin = ${xmin}`)
  });

// In another function
handle.remove()
```

The [once()] and [whenOnce()] methods return a Promise instead of a `WatchHandle`. In some advanced use cases where an API action may take additional time, these methods also offer the option to cancel the async callback via an [`AbortSignal`]. Be aware that if the returned Promise is not resolved, it can also result in a memory leak.

```
// Use an AbortSignal to cancel an async callback
// during view animation
const abortController = new AbortController();

// Observe the View's animation state
reactiveUtils.whenOnce(
  () => view?.animation, {signal: abortController.signal})
  .then((animation) => {
    console.log(`View animation state is ${animation.state}`)
  });

// Cancel the async callback
const someFunction = () => {
  abortController.abort();
}
```



### Working with truthy values

The [when()] and [whenOnce()] methods watch for *truthy* values, these are values that evaluate to `true` in boolean contexts. To learn more about using truthy, visit this [MDN Web doc](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) article. The snippets below use the [Popup.visible](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Popup.html) property, which is a boolean.

```
// Observe changes on a boolean property
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.when(() => viewElement.popup?.visible, () => console.log("Truthy"));
reactiveUtils.when(() => !viewElement.popup?.visible, () => console.log("Not truthy"));
reactiveUtils.when(() => viewElement.popup?.visible === true, () => console.log("True"));
reactiveUtils.when(() => viewElement.popup?.visible !== undefined, () => console.log("Defined"));
reactiveUtils.when(() => viewElement.popup?.visible === undefined, () => console.log("Undefined"));
```

## Method Overview

| Name    | Return Type | Summary                                                      | Object        |
| ------- | ----------- | ------------------------------------------------------------ | ------------- |
| watch() | WatchHandle | Tracks any properties accessed in the `getValue` function and calls the callback when any of them change. | reactiveUtils |

### Method Details
<table><tr><td bgcolor=#ddd><b>watch(getValue, callback, options?){WatchHandle}</b></td></tr></table>

Tracks any properties accessed in the `getValue` function and calls the callback when any of them change.

Parameters:

| **getValue**                                                 | ReactiveWatchExpression   |
| ------------------------------------------------------------ | ------------------------- |
| Function used to get the current value. All accessed properties will be tracked. |                           |
| **callback**                                                 | **ReactiveWatchCallback** |
| The function to call when there are changes.                 |                           |
| **options**                                                  | **ReactiveWatchOptions**  |
| Options used to configure how the tracking happens and how the callback is to be called. |                           |

Returns:

| Type        | Description    |
| ----------- | -------------- |
| WatchHandle | A watch handle |

Examples

```js
// Watching for changes in a boolean value
// Equivalent to watchUtils.watch()
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
 () => viewElement.popup?.visible,
 () => {
   console.log(`Popup visible: ${viewElement.popup.visible}`);
 });
// Watching for changes within a Collection
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
 () => viewElement.map.allLayers.length,
 () => {
   console.log(`Layer collection length changed: ${viewElement.map.allLayers.length}`);
 });
// Watch for changes in a numerical value.
// Providing `initial: true` in ReactiveWatchOptions
// checks immediately after initialization
// Equivalent to watchUtils.init()
const viewElement = document.querySelector("arcgis-map");
reactiveUtils.watch(
 () => viewElement.zoom,
 () => {
   console.log(`zoom changed to ${viewElement.zoom}`);
 },
 {
   initial: true
 });
// Watch properties from multiple sources
const viewElement = document.querySelector("arcgis-map");
const handle = reactiveUtils.watch(
 () => [viewElement.stationary, viewElement.zoom],
 ([stationary, zoom]) => {
   // Only print the new zoom value when the map component is stationary
   if(stationary){
     console.log(`Change in zoom level: ${zoom}`);
   }
 }
);
```

## Type Definitions

<table><tr><td bgcolor=#ddd><b>WatchHandle</b> <span>Object</span></td></tr></table>

Represents a watch or event handler which can be removed.

Property:

| **remove**                | [Function] |
| ------------------------- | ------------------------------------------------------------ |
| Removes the watch handle. |                                                              |

Example:

``` javascript
const handle = reactiveUtils.watch(() => map.basemap, (newVal) => {
  // Each time the value of map.basemap changes, it is logged in the console
  console.log("new basemap: ", newVal);
});

// When remove() is called on the watch handle, the map no longer watches for changes to basemap
handle.remove();
```

<table><tr><td bgcolor=#ddd><b>ReactiveEqualityFunction(newValue, oldValue) {Boolean}</b></td></tr></table>

Function used to check whether two values are the same, in which case the watch callback isn't called.

Parameters:

| **newValue**   | *    |
| -------------- | ---- |
| The new value. |      |
| **oldValue**   | *    |
| The old value. |      |

Returns:

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| Boolean | Whether the new value is equal to the old value. |

<table><tr><td bgcolor=#ddd><b>ReactiveListenerChangeCallback(target?)</b></td></tr></table>

Function used to check whether two values are the same, in which case the watch callback isn't called.

Parameters:

| **target**                                                   | *    |
| ------------------------------------------------------------ | ---- |
| The event target to which the listener was added or from which it was removed. |      |

<table><tr><td bgcolor=#ddd><b>ReactiveWatchCallback(newValue, oldValue) {Boolean}</b></td></tr></table>

Function to be called when a value changes.

Parameters:

| **newValue**   | *    |
| -------------- | ---- |
| The new value. |      |
| **oldValue**   | *    |
| The old value. |      |

<table><tr><td bgcolor=#ddd><b>ReactiveWatchExpression(){*}</b></td></tr></table>

Function which is auto-tracked and should return a value to pass to the ReactiveWatchCallback

Returns:

| Type | Description    |
| ---- | -------------- |
| *    | The new value. |

<table><tr><td bgcolor=#ddd><b>ReactiveWatchOptions</b> <span>Object</span></td></tr></table>

Options used to configure how auto-tracking is performed and how the callback should be called.

Property:

| **initial**                                                  | Boolean                      |
| ------------------------------------------------------------ | ---------------------------- |
| Default Value:false<br />Whether to fire the callback immediately after initialization, if the necessary conditions are met. |                              |
| **sync**                                                     | **Boolean**                  |
| Default Value:false<br />Whether to fire the callback synchronously or on the next tick. |                              |
| **once**                                                     | **Boolean**                  |
| Default Value:false<br />Whether to fire the callback only once. |                              |
| **equals**                                                   | **ReactiveEqualityFunction** |
| Function used to check whether two values are the same, in which case the callback isn't called. Checks whether two objects, arrays or primitive values are shallow equal, e.g. one level deep. Non-plain objects are considered equal if they are strictly equal (===). |                              |

