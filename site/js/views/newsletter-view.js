// site/js/views/newsletter-view.js


define([
    'backbone',
    'text!tpl/NewsletterView.html'
  ],
  function (Backbone, NewsletterViewHTML) {
    var NewsletterView  = Backbone.View.extend({
      tagName: 'div',

      className: 'newsletter_details',

      template: _.template(NewsletterViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of newsletter-view.js');
      },

      render: function () {
        console.log('in newsletter-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return NewsletterView;
  }
);
