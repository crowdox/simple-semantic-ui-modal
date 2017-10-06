import Ember from 'ember';
// Relative path works since both survey and manage are in lib/...
import ExtendModalMixin from '../mixins/extend-modal';

export function initialize(/* application */) {
  Ember.Component.reopen(ExtendModalMixin);
  Ember.Controller.reopen(ExtendModalMixin);
}

export default {
  name: 'modal',
  initialize
};
