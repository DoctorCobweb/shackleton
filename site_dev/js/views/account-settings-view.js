// site/js/views/account-settings-view.js
// display the settings the user has.


//all user attribute inputs apart from the first field for resetting the password 
//have the ENTER key bound to submit the changes to the backend.


define([
    'backbone',
    'text!tpl/AccountSettings.html',
    'text!tpl/UserFeedback.html',
    'models/user-model'
  ], 
  function (Backbone, AccountSettingsHTML, UserFeedbackHTML, User) {
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
        //'click #submit_new_user_details': 'submit_new_user_details'
        'click #submit_new_user_details': 'update_user_details'

      },

      initialize: function () {
        console.log('in initialize() of account-settings-view.js');
        this.current_view = this;
        this.ENTER_KEY = 13;

        if (!this.user) {
          //this.user = new User(this.model);
          this.user = new User();

          console.log('this.model.id: ' + this.model.id);
          //console.log(this.model.attributes);

          //setup the attributes needed to set on the user model
          var _attr = {};
          _attr._id = this.model.attributes._id;
          _attr.first_name = this.model.attributes.first_name;
          _attr.last_name = this.model.attributes.last_name;
          _attr.email_address = this.model.attributes.email_address;
          _attr.phone_number = this.model.attributes.phone_number;
          _attr.braintree_customer_id = this.model.attributes.braintree_customer_id;
 
          //set the attributes on the user model
          this.user.set(_attr);
        }

        //console.log('this.user backbone model, in initialize: ');
        //console.log(this.user);
        //console.log('isNew(): ' + this.user.isNew());
      },

      render: function () {
        console.log('in account-settings-view.js and render()');
        console.log('this.model:');
        console.log(this.model);

        this.$el.html(this.template(this.model.toJSON()));
    
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


      new_password_1: function (e) {
        console.log('new_password_1');
      },     


      new_password_2: function (e) {
        console.log('new_password_2');
        if (e.which === this.ENTER_KEY) {
          this.$new_password_2.blur();
          this.submit_new_password();

        }
      },     


      first_name: function (e) {
        console.log('first_name');

        //if the user hits the ENTER key make the save to the backend.
        if (e.which === this.ENTER_KEY) {
          console.log('first_name ENTER KEY HIT');

          //defocus the input field
          this.$first_name.blur();
      
          //actually make the save function call now
          this.update_user_details();
        }
      },     


      last_name: function (e) {
        console.log('last_name');
        if (e.which === this.ENTER_KEY) {
          //defocus the input field
          this.$last_name.blur();
          this.update_user_details();
        }
      },     


      email_address: function (e) {
        console.log('email_address');
        if (e.which === this.ENTER_KEY) {
          this.$email_address.blur();
          this.update_user_details();
        }
      },     


      phone_number: function (e) {
        console.log('phone_number');
        if (e.which === this.ENTER_KEY) {
          this.$phone_number.blur();
          this.update_user_details();
        }
      },     


      new_password_1_blur: function () {
        this.close_input_field(this.$new_password_1, 'new_password_1');
      },

      new_password_2_blur: function () {
        this.close_input_field(this.$new_password_2, 'new_password_2');
      },


      first_name_blur: function () {
        console.log('first_name_blur function ');
        this.change_user_model_attribute(this.$first_name, 'first_name');
      },

      last_name_blur: function () {
        console.log('last_name_blur function ');
        this.change_user_model_attribute(this.$last_name, 'last_name');
      },

      email_address_blur: function () {
        console.log('email_address_blur function ');
        this.change_user_model_attribute(this.$email_address, 'email_address');
      },

      phone_number_blur: function () {
        console.log('phone_number_blur function ');
        this.change_user_model_attribute(this.$phone_number, 'phone_number');
      },


      change_user_model_attribute: function (input_element, model_attribute) {
        var value = input_element.val().trim();
        this.user.set(model_attribute, value);

        //console.log('this.user.attributes model: ');
        //console.log(this.user.attributes);
        //console.log('this.user.get(\'first_name\'): ' + this.user.get('first_name'));
      },

      update_user_details: function () {
        console.log('*** UPDATING SETTINGS ***');
        //console.log('this.user backbone model: ');
        //console.log(this.user);
        var self = this;

        this.user.save({}, {
          success: function (model, response, options) {
            console.log('SUCCESS: updated user settings!!!');
            console.dir(model);
            console.log(response);
            console.log(options);

            //reset the model for this view to reflect the update
            self.model = model; 

            //then re-render the UI
            self.render();

          },
          error: function (model, xhr, options) {
            console.log('ERROR: could not update user settings!!!');
            console.dir(model);
            console.log(xhr);
            console.log(options);
          },
        });
      },


      close_input_field: function (input_element, model_attribute) {
        var value = input_element.val().trim();
        this.user_entered_data[model_attribute] = value;
        //console.log(this.user_entered_data);
      },



      submit_new_password: function () {
        console.log('in submit_new_password');
        console.log('this.user_entered_data object: ');
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
          }
        })
      },



      /* 
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
          }
        })
      },
      */



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
