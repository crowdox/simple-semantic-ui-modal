import { isBlank } from '@ember/utils';
import { bind, scheduleOnce } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
import SpreadMixin from 'ember-spread';
// Relative path works since both survey and manage are in lib/...
import SSTransition from '../mixins/ss-transition';
import { observer } from '@ember/object';
import jQuery from 'jquery';

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
  closable: false,
  isActiveModal: true,

  _isShown: false,

  // Transition Defaults
  transitionMode: 'scale',
  transitionDuration: 500,

  isActiveChanged: observer('isActiveModal', function() {
    scheduleOnce('afterRender', () => {
      if (this.get('isActiveModal')) {
        jQuery(this.element).removeClass('secondary');
      } else {
        jQuery(this.element).addClass('secondary');
      }
    });
  }),

  // Setup and destroy
  didInsertElement() {
    this._super(...arguments);
    // Ensure scrolling is gone for initial render
    this.removeScrolling();
    // Add body classes
    jQuery('body').addClass('dimmable dimmed');
    // Set values
    this.doRefresh();
    this.transitionIn();
    jQuery(window).on('resize.ss-modal-' + this.get('elementId'), bind(this, this.doRefreshWithAnimation));
    if (this.get('closable')) {
      jQuery(document).on('click.ss-modal-' + this.get('elementId'), bind(this, this.checkClick));
    }
    this.observeChanges();
  },

  willDestroyElement() {
    this._super(...arguments);
    jQuery(window).off('resize.ss-modal-' + this.get('elementId'));
    jQuery(document).off('click.ss-modal-' + this.get('elementId'));
    if (this.get('observer') != null) {
      this.get('observer').disconnect();
    }
    jQuery('body').removeClass('dimmable dimmed');
  },

  // Events
  checkClick(event) {
    if (!this.get('_isShown')) {
      return;
    }
    let target = jQuery(event.target);
    let isInModal = target.closest(jQuery(this.element)).length > 0;
    let isInDOM = jQuery.contains(window.document.documentElement, event.target);

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
    let modalHeight = jQuery(this.element).outerHeight();
    return {
      pageHeight    : jQuery(document).outerHeight(),
      height        : modalHeight + this.get('offset'),
      contextHeight : jQuery(window).height()
    };
  },

  canFit(sizes) {
    return sizes.height + (this.get('padding') * 2) < sizes.contextHeight;
  },

  removeScrolling() {
    jQuery('body').removeClass('scrolling');
    jQuery(this.element).parent().css({
      overflow: ''
    });
    jQuery(this.element).removeClass('scrolling');
  },

  setScrolling() {
    jQuery('body').addClass('scrolling');
    jQuery(this.element).parent().css({
      overflow: 'auto'
    });
    jQuery(this.element).addClass('scrolling');
  },

  setPosition(sizes) {
    if (this.canFit(sizes)) {
      jQuery(this.element).css({
        top: '',
        marginTop: -(sizes.height / 2)
      });
    } else {
      jQuery(this.element).css({
        marginTop : '',
        top       : jQuery(document).scrollTop()
      });
    }
  },

  setScreenHeight(sizes) {
    if (this.canFit(sizes)) {
      jQuery('body').css('height', '');
    } else {
      jQuery('body').css('height', sizes.height + (this.get('padding') * 2) );
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
