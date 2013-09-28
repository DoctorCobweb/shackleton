// site/js/views/successful-registration-view.js
//the view for a successful registration to be displayed.

define([
    'backbone',
    'text!tpl/SuccessfulRegistration.html'
  ], 
  function (Backbone, SuccessfulRegistrationHTML) {
    var SuccessfulRegistration = Backbone.View.extend({
      tagName: 'div',
 
      className: 'successful_registration_details',

      template: _.template(SuccessfulRegistrationHTML),

      events: {},

      initialize: function () {
        console.log('in initialize() of successful-registration-view.js');

        this.switch_log_button('#logout_header','#login_header');
        //this.user = new User();
        //this.model = 

      },

      render: function () {
        console.log('in successful-registration-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());
  
        return this;
      },

      switch_log_button: function (element_to_show, element_to_hide) {
        $(element_to_hide).css('display', 'none');
        $(element_to_show).css('display', 'block');
      }
    });
    return SuccessfulRegistration;

  }
);
