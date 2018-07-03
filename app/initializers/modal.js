import Controller from '@ember/controller';
import Component from '@ember/component';
// Relative path works since both survey and manage are in lib/...
import ExtendModalMixin from '../mixins/extend-modal';

export function initialize(/* application */) {
  Component.reopen(ExtendModalMixin);
  Controller.reopen(ExtendModalMixin);
}

export default {
  name: 'modal',
  initialize
};
