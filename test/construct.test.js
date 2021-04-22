import Accessor from '../dist/index.js';
import assert from 'assert';

describe('#constructor()', function() {
  it('typeof accessor should be "object"', function() {
    const accessor = new Accessor();
    assert.strictEqual(typeof accessor, 'object');
  });
  it('subclass can extend from Accessor', function() {
    class View extends Accessor {
      constructor() {
        super();
        this.declaredClass = "View";
      }
    }
    const view = new View();
    assert.strictEqual(view instanceof Accessor, true);
  });
});