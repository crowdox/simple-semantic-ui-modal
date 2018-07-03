import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    open_modal: function() {
      let args = Array.prototype.slice.call(arguments);
      let name = args.shift();
      let options = args.shift();
      let controller = this.controllerFor('application');

      // Wire up the close event
      if (options == null) {
        options = {};
      }
      let modalId = guidFor(name);
      options.modal_closed = this.generateModalClosed(controller, modalId);

      if (controller.get('modals') == null) {
        controller.set('modals', A());
      }
      controller.get('modals').pushObject({
        id: modalId,
        name: name,
        options: options
      });
    }
  },

  generateModalClosed(controller, modalId) {
    return function() {
      if (controller.get('isDestroyed') || controller.get('isDestroying')) { return; }
      controller.set('modals', controller.get('modals').rejectBy('id', modalId));
    };
  }
});
