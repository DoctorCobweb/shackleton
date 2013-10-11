// site/js/views/real-front-page-view.js


define([
    'backbone',
    'text!tpl/RealFrontPageView.html'
  ],
  function (Backbone, RealFrontPageViewHTML) {
    var RealFrontPageView  = Backbone.View.extend({
      //tagName: 'div',

      //className: 'real_front_page_details',

      el:'#the_overbearer',

      template: _.template(RealFrontPageViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of real-front-page-view.js');
      },

      render: function () {
        console.log('in real-front-page-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return RealFrontPageView;
  }
);
