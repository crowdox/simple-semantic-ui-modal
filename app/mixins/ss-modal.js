import { isBlank } from '@ember/utils';
import { bind } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
import SpreadMixin from 'ember-spread';
// Relative path works since both survey and manage are in lib/...
import SSTransition from '../mixins/ss-transition';

const requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame ||
                              function(callback) { setTimeout(callback, 0); };

export default Mixin.create(SpreadMixin, SSTransition, {
  classNames: ['ui', 'modal'],

  // Defaults
  padding: 50,
  offset: 0,
  closable: true,

  _isShown: false,

  // Transition Defaults
  transitionMode: 'scale',
  transitionDuration: 500,

  // Setup and destroy
  didInsertElement() {
    this._super(...arguments);
    // Ensure scrolling is gone for initial render
    this.removeScrolling();
    // Add body classes
    window.$('body').addClass('dimmable dimmed');
    // Set values
    this.doRefresh();
    this.transitionIn();
    window.$(window).on('resize.ss-modal-' + this.get('elementId'), bind(this, this.doRefreshWithAnimation));
    if (this.get('closable')) {
      window.$(document).on('click.ss-modal-' + this.get('elementId'), bind(this, this.checkClick));
    }
    this.observeChanges();
  },

  willDestroyElement() {
    this._super(...arguments);
    window.$(window).off('resize.ss-modal-' + this.get('elementId'));
    window.$(document).off('click.ss-modal-' + this.get('elementId'));
    if (this.get('observer') != null) {
      this.get('observer').disconnect();
    }
    window.$('body').removeClass('dimmable dimmed');
  },

  // Events
  checkClick(event) {
    if (!this.get('_isShown')) {
      return;
    }
    let target = window.$(event.target);
    let isInModal = target.closest(this.$()).length > 0;
    let isInDOM = window.$.contains(window.document.documentElement, event.target);

    if (!isInModal && isInDOM) {
      this.closeModal();
    }
  },

  observeChanges() {
    if ('MutationObserver' in window) {
      let observer = new MutationObserver(() => this.doRefresh());
      observer.observe(this.get('element'), {
        childList : true,
        subtree   : true
      });
      this.set('observer', observer);
    }
  },

  // Public method to close
  closing() { }, // callback hook

  closeModal() {
    this.closing();
    this.transitionOut();
  },

  opened() { }, // callback hook

  // Overwrite transition callback
  shown() {
    this.set('_isShown', true);
    this.opened();
  },

  // Overwrite transition callback
  hidden() {
    let modalClosed = this.get('modal_closed');
    if (typeof modalClosed === "function") {
      modalClosed();
    }
  },

  // Functions
  doRefresh(sizes) {
    if (this.get('isDestroyed') || this.get('isDestroying')) { return; }
    if (isBlank(sizes)) {
      sizes = this.getSizes();
    }
    this.setScreenHeight(sizes);
    this.setType(sizes);
    this.setPosition(sizes);
  },

  doRefreshWithAnimation() {
    requestAnimationFrame(bind(this, this.doRefresh, null));
  },

  // Method functions
  getSizes() {
    let modalHeight = this.$().outerHeight();
    return {
      pageHeight    : window.$(document).outerHeight(),
      height        : modalHeight + this.get('offset'),
      contextHeight : window.$(window).height()
    };
  },

  canFit(sizes) {
    return sizes.height + (this.get('padding') * 2) < sizes.contextHeight;
  },

  removeScrolling() {
    window.$('body').removeClass('scrolling');
    this.$().parent().css({
      overflow: ''
    });
    this.$().removeClass('scrolling');
  },

  setScrolling() {
    window.$('body').addClass('scrolling');
    this.$().parent().css({
      overflow: 'auto'
    });
    this.$().addClass('scrolling');
  },

  setPosition(sizes) {
    if (this.canFit(sizes)) {
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

  setScreenHeight(sizes) {
    if (this.canFit(sizes)) {
      window.$('body').css('height', '');
    } else {
      window.$('body').css('height', sizes.height + (this.get('padding') * 2) );
    }
  },

  setType(sizes) {
    if (this.canFit(sizes)) {
      this.removeScrolling();
    } else {
      this.setScrolling();
    }
  },

  actions: {
    close() {
      this.closeModal();
    }
  }
});
