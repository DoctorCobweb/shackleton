// site/js/views/faq-view.js


define([
    'backbone',
    'text!tpl/FaqView.html'
  ],
  function (Backbone, FaqViewHTML) {
    var FaqView  = Backbone.View.extend({
      tagName: 'div',

      className: 'faq_details',

      template: _.template(FaqViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of faq-view.js');
      },

      render: function () {
        console.log('in faq-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return FaqView;
  }
);
