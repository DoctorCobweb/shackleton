// site/js/views/account-settings-view.js
// display the settings the user has.

define([
    'backbone',
    'text!tpl/AccountSettings.html',
    'text!tpl/UserFeedback.html'
  ], 
  function (Backbone, AccountSettingsHTML, UserFeedbackHTML) {
    var AccountSettingsView = Backbone.View.extend({
      tagName: 'div',
 
      className: 'account_settings_details',

      template: _.template(AccountSettingsHTML),

      events: {
        'keypress #new_password_1':       'new_password_1',
        'keypress #new_password_2':       'new_password_2',
        'keypress #first_name':           'first_name',
        'keypress #last_name':            'last_name',
        'keypress #email_address':        'email_address',
        'keypress #phone_number':         'phone_number',
        'blur #new_password_1':           'new_password_1_blur',
        'blur #new_password_2':           'new_password_2_blur',
        'blur #first_name':               'first_name_blur',
        'blur #last_name':                'last_name_blur',
        'blur #email_address':            'email_address_blur',
        'blur #phone_number':             'phone_number_blur',
        'click #submit_new_password':     'submit_new_password',
        'click #submit_new_user_details': 'submit_new_user_details'

      },

      initialize: function () {
        console.log('in initialize() of account-settings-view.js');
        this.current_view = this;

      },

      render: function () {
        console.log('in account-settings-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());
    
        //cache the input elems using jQuery
        this.$first_name = this.$('#first_name');
        this.$last_name = this.$('#last_name');
        this.$email_address = this.$('#email_address');
        this.$phone_number = this.$('#phone_number');
        this.$new_password_1 = this.$('#new_password_1');
        this.$new_password_2 = this.$('#new_password_2');
  
        this.user_entered_data = {};

        return this;
      },

      new_password_1: function () {
        console.log('new_password_1');
      },     

      new_password_2: function () {
        console.log('new_password_1');
      },     


      first_name: function () {
        console.log('first_name');
      },     


      last_name: function () {
        console.log('last_name');
      },     


      email_address: function () {
        console.log('email_address');
      },     


      phone_number: function () {
        console.log('phone_number');
      },     


      new_password_1_blur: function () {
        this.close_input_field(this.$new_password_1, 'new_password_1');
      },

      new_password_2_blur: function () {
        this.close_input_field(this.$new_password_2, 'new_password_2');
      },

      first_name_blur: function () {
        this.close_input_field(this.$first_name, 'first_name');
      },

      last_name_blur: function () {
        this.close_input_field(this.$last_name, 'last_name');
      },

      email_address_blur: function () {
        this.close_input_field(this.$email_address, 'email_address');
      },

      phone_number_blur: function () {
        this.close_input_field(this.$phone_number, 'phone_number');
      },

      close_input_field: function (input_element, model_attribute) {

        var value = input_element.val().trim();
        this.user_entered_data[model_attribute] = value;

        console.log(this.user_entered_data);

      },

      submit_new_password: function () {
        console.log('in submit_new_password');
        console.log(this.user_entered_data);

        var self = this;

        $.ajax({
          'url': '/api/users/change_password/',
          'type': 'POST',
          'data': self.user_entered_data,
          success: function (data, textStatus, jqXHR) {
            console.log('AJAX SUCCESS: posted the change password data');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);


            if (data.errors) {
     
              //TODO: reflect the errors to UI properly
              console.log('error returned');
              console.log(data);
              alert('error in input, check console.log');

            } else {
              console.log($('#featureContent'));
  
              //display a UI element spanning across the screen
              //saying what's happened 
              $('#featureContent').prepend(_.template(UserFeedbackHTML));
              self.render();
            }


          },
          error: function (jqXHR, textStatus, errorThown) {
            console.log('AJAX ERROR: in postin the change password data');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);


          },
        })
      },
 
      submit_new_user_details: function () {
        console.log('in submit_new_user_details');
        console.log(this.user_entered_data);

        var self = this;

        $.ajax({
          'url': '/api/users/change_user_details',
          'type': 'POST',
          'data': self.user_entered_data,
          success: function (data, textStatus, jqXHR) {
            console.log('AJAX SUCCESS: posted the change user details data');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.errors) {
     
              //TODO: reflect the errors to UI properly
              console.log('error returned');
              console.log(data);
              alert('error in input, check console.log');

            } else {
              console.log($('#featureContent'));
  
              //display a UI element spanning across the screen
              //saying what's happened 
              $('#featureContent').prepend(_.template(UserFeedbackHTML));
              self.render();
            }

          },
          error: function (jqXHR, textStatus, errorThown) {
            console.log('ERROR: in postin the change user details data');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);


          },
        })
        





      },
      show_view: function (selector, view) {
        console.log('in show_view()');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      }
    });

    return AccountSettingsView;
  }
);
