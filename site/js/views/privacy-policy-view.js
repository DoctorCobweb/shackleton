// site/js/views/privacy-policy-view.js


define([
    'backbone',
    'text!tpl/PrivacyPolicyView.html'
  ],
  function (Backbone, PrivacyPolicyViewHTML) {
    var PrivacyPolicyView  = Backbone.View.extend({
      tagName: 'div',

      className: 'privacy_policy_details',

      template: _.template(PrivacyPolicyViewHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of privacy-policy-view.js');
      },

      render: function () {
        console.log('in privacy-policy-view.js and render()');

        this.$el.html(this.template());

        return this;
      }
    });
    return PrivacyPolicyView;
  }
);
