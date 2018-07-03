import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    open_modal: function(name) {
      var args = Array.prototype.slice.call(arguments, 1);
      getOwner(this)
        .lookup('route:application')
        .send('open_modal', name, args.length > 0 ? args[0] : null);
    }
  }
});
