import Ember from 'ember';
import SpreadMixin from 'ember-spread';
import SSTransition from 'manage/mixins/ss-transition';

const requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame ||
                              function(callback) { setTimeout(callback, 0) };

// TODO:
// - Add body classes and height
// - Add click away
// - Observe changes
// - Keyboard escape?

export default Ember.Mixin.create(SpreadMixin, SSTransition, {
  classNames: ['ui', 'modal'],

  // Defaults
  padding: 50,
  offset: 0,
  closable: true,

  // Transition Defaults
  transitionMode: 'scale',
  transitionDuration: 500,

  didInsertElement() {
    this._super(...arguments);
    this.setScreenHeight();
    this.removeScrolling();
    this.doRefresh();
    window.$(window).on('resize.ss-modal-' + this.get('elementId'), Ember.run.bind(this, this.doRefreshWithAnimation));
    if (this.get('closable')) {
      // Ember.$(document).on('click.inline-edit-' + this.get('elementId'), (event) => this.detect_click_away.apply(this, [event]));
      // Click away
      // click: function(event) {
      //      var
      //        $target   = $(event.target),
      //        isInModal = ($target.closest(selector.modal).length > 0),
      //        isInDOM   = $.contains(document.documentElement, event.target)
      //      ;
      //      if(!isInModal && isInDOM) {
      //        module.debug('Dimmer clicked, hiding all modals');
      //        if( module.is.active() ) {
      //          module.remove.clickaway();
      //          if(settings.allowMultiple) {
      //            module.hide();
      //          }
      //          else {
      //            module.hideAll();
      //          }
      //        }
      //      }
    }

    // Observe Changes
    // observeChanges: function() {
    //   if('MutationObserver' in window) {
    //     observer = new MutationObserver(function(mutations) {
    //       module.debug('DOM tree modified, refreshing');
    //       module.refresh();
    //     });
    //     observer.observe(element, {
    //       childList : true,
    //       subtree   : true
    //     });
    //     module.debug('Setting up mutation observer', observer);
    //   }
    // },
  },

  closeModal() {
    this.transitionOut();
  },

  // Overwrite transition callback
  hidden() {
    let modalClosed = this.get('modal_closed');
    if (typeof modalClosed === "function") {
      modalClosed();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    window.$(window).off('resize.ss-modal-' + this.get('elementId'));
    // Ember.$(document).on('click.inline-edit-' + this.get('elementId'), (event) => this.detect_click_away.apply(this, [event]));
  },

  // Functions
  doRefresh() {
    this.setType();
    this.setPosition();
    this.transitionIn();
  },

  // refresh: function() {
  //   module.remove.scrolling();
  //   module.cacheSizes();
  //   module.set.screenHeight();
  //   module.set.type();
  //   module.set.position();
  // },

  doRefreshWithAnimation() {
    requestAnimationFrame(Ember.run.bind(this, this.doRefresh));
  },

  getSizes() {
    let modalHeight = this.$().outerHeight();
    return {
      pageHeight    : window.$(document).outerHeight(),
      height        : modalHeight + this.get('offset'),
      contextHeight : window.$(window).height()
    };
  },

  canFit() {
    let sizes = this.getSizes();
    return ( ( sizes.height + (this.get('padding') * 2) ) < sizes.contextHeight);
  },

  getDimmer() {
    return window.$('.ui.modals.page.dimmer');
  },

  removeScrolling() {
    this.getDimmer().removeClass('scrolling');
    this.$().removeClass('scrolling');
  },

  setScrolling() {
    this.getDimmer().addClass('scrolling');
    this.$().addClass('scrolling');
  },

  setPosition() {
    if (this.canFit()) {
      let sizes = this.getSizes();
      this.$().css({
        top: '',
        marginTop: -(sizes.height / 2)
      });
    } else {
      this.$().css({
        marginTop : '',
        top       : window.$(document).scrollTop()
      });
    }
  },

  setScreenHeight() {
    if (this.canFit()) {
      window.$('body').css('height', '');
    } else {
      let sizes = this.getSizes();
      window.$('body').css('height', sizes.height + (this.get('padding') * 2) );
    }
  },

  setType() {
    if (this.canFit()) {
      this.removeScrolling();
    } else {
      this.setScrolling();
    }
  }
});
