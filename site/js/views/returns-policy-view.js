// site/js/views/returns-policy-view.js


define([
    'backbone',
    'text!tpl/ReturnsPolicyView.html'
  ],
  function (Backbone, ReturnsPolicyViewHTML) {
    var ReturnsPolicyView  = Backbone.View.extend({
      tagName: 'div',

      className: 'returns_policy_details',

      template: _.template(ReturnsPolicyViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of returns-policy-view.js');
      },

      render: function () {
        console.log('in returns-policy-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return ReturnsPolicyView;
  }
);
