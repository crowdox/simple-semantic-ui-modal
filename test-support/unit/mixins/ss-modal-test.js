import Ember from 'ember';
import SsModalMixin from 'simple-semantic-ui-modal/mixins/ss-modal';
import { module, test } from 'qunit';

module('Unit | Mixin | ss modal');

// Replace this with your real tests.
test('it works', function(assert) {
  let SsModalObject = Ember.Object.extend(SsModalMixin);
  let subject = SsModalObject.create();
  assert.ok(subject);
});