import Ember from 'ember';
import ExtendModalMixin from 'manage/mixins/extend-modal';

export function initialize(/* application */) {
  Ember.Component.reopen(ExtendModalMixin);
  Ember.Controller.reopen(ExtendModalMixin);
}

export default {
  name: 'modal',
  initialize
};
