import Accessor from '../dist/index.js';
import assert from 'assert';

describe('#watch()', function() {
  it('watch property change', function() {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    }
    const view = new Accessor();
    view.zoom = 4;
    view.watch('zoom', callback);
    view.zoom = 5;
    assert.deepStrictEqual(result, [5, 4, 'zoom', view]);
  });
  /**
   * 调用remove方法移除handle，callback将不执行
   */
  it('remove watch handle', function() {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    }
    const view = new Accessor();
    view.zoom = 4;
    const handle = view.watch('zoom', callback);
    handle.remove();
    view.zoom = 5;
    assert.deepStrictEqual(result, []);
  });
  /**
   * 只在注册的属性变更后执行callback
   */
  it('only watch registered property', function() {
    const result = [];
    const callback = (newValue, oldValue, propertyName, target) => {
      result.push(newValue, oldValue, propertyName, target);
    }
    const view = new Accessor();
    view.zoom = 4;
    view.watch('scale', callback);
    view.zoom = 5;
    assert.deepStrictEqual(result, []);
  });
});