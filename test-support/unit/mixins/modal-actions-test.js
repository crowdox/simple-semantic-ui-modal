import Ember from 'ember';
// Relative path works since both survey and manage are in lib/...
import ModalActionsMixin from '../../../mixins/modal-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | modal actions');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModalActionsObject = Ember.Object.extend(ModalActionsMixin);
  let subject = ModalActionsObject.create();
  assert.ok(subject);
});
