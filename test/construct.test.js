import Accessor from '../dist/index.js';
import assert from 'assert';

describe('#constructor()', function() {
  it('typeof accessor should be "object"', function() {
    const accessor = new Accessor();
    assert.strictEqual(typeof accessor, 'object');
  });
  /**
   * 可以通过 对象的形式给类 赋初值
   */
  it('accessor\'s props can be an object', function() {
    const view = new Accessor({
      zoom: 4,
    });
    assert.strictEqual(view.zoom, 4);
  });
  /**
   * 子类可以继承Accessor
   */
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