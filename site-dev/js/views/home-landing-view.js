// site/js/views/home-landing-view.js

//home landin view, bro.

define([
    'backbone',
    'text!tpl/HomeLandingView.html'
  ],
  function (Backbone, HomeLandingHTML) {
    var HomeLandingView = Backbone.View.extend({
      tagName: 'div',

      className: 'home_landing_details',

      template: _.template(HomeLandingHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of home-landing-view.js');
      },

      render: function () {
        console.log('in home -landing-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return HomeLandingView;
  }
);
