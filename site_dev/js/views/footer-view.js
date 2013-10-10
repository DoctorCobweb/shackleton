// site/js/views/footer-view.js


define([
    'backbone',
    'text!tpl/FooterView.html'
  ],
  function (Backbone, FooterViewHTML) {
    var FooterView  = Backbone.View.extend({
      tagName: 'div',

      className: 'footer_details',

      template: _.template(FooterViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of footer-view.js');
      },

      render: function () {
        console.log('in footer-view.js and render()');

        //at the moment we have no model assigned to go to AboutViewHTML template
        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());

        return this;
      }
    });
    return FooterView;
  }
);
