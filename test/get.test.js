import Accessor from '../dist/index.js';
import assert from 'assert';

describe('#get()', function() {
  it('should return undefined when the property in the path does not exist', function() {
    const accessor = new Accessor();
    assert.strictEqual(accessor.get('map'), undefined);
  });
  it('should return 4 when the property is set to 4', function() {
    const view = new Accessor();
    view.set('zoom', 4);
    assert.strictEqual(view.get('zoom'), 4);
  });
  it('deep path:should return undefined when the property in the path does not exist', function() {
    const view = new Accessor();
    assert.strictEqual(view.get('map.basemap'), undefined);
  });
  it('should return the property in the deep path', function() {
    const map = new Accessor();
    const basemap = new Accessor();
    map.set('basemap', basemap);
    basemap.set('title', 'grey');
    assert.strictEqual(map.get('basemap.title'), 'grey');
  });
});