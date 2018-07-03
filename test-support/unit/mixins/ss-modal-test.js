import EmberObject from '@ember/object';
// Relative path works since both survey and manage are in lib/...
import SsModalMixin from '../../../mixins/ss-modal';
import { module, test } from 'qunit';

module('Unit | Mixin | ss modal');

// Replace this with your real tests.
test('it works', function(assert) {
  let SsModalObject = EmberObject.extend(SsModalMixin);
  let subject = SsModalObject.create();
  assert.ok(subject);
});
