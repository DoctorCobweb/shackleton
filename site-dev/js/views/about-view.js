// site/js/views/about-view.js


define([
    'backbone',
    'text!tpl/AboutView.html'
  ],
  function (Backbone, AboutViewHTML) {
    var AboutView  = Backbone.View.extend({
      tagName: 'div',

      className: 'about_details',

      template: _.template(AboutViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of about-view.js');
      },

      render: function () {
        console.log('in about-view.js and render()');

        //at the moment we have no model assigned to go to AboutViewHTML template
        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());

        return this;
      }
    });
    return AboutView;
  }
);
