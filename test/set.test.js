import Accessor from '../dist/index.js';
import assert from 'assert';

describe('#set()', function() {
  it('should return 4 when the property is set to 4', function() {
    const view = new Accessor();
    view.set('zoom', 4);
    assert.strictEqual(view.get('zoom'), 4);
  });
  it('should return 4 when the property is 4', function() {
    const view = new Accessor();
    view.zoom = 4;
    assert.strictEqual(view.zoom, 4);
  });
});