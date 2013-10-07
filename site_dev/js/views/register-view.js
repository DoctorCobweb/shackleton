// site/js/views/register-view.js


define([
    'backbone',
    'text!tpl/RegisterView.html',
    'views/successful-registration-view',
    'models/user-model'
  ],
  function (Backbone, RegisterHTML, SuccessfulRegistration, User) {
    var RegisterView = Backbone.View.extend({
      tagName: 'div',

      className: 'registerDetails',

      template: _.template(RegisterHTML),

      events: {
        'keypress #first_name':    'first_name_keypress',
        'keypress #last_name':     'last_name_keypress',
        'keypress #phone_number':  'phone_number_keypress',
        'keypress #email_address': 'email_address_keypress',
        'keypress #password':      'password_keypress',
        'blur #first_name':        'first_name_blur',
        'blur #last_name':         'last_name_blur',
        'blur #phone_number':      'phone_number_blur',
        'blur #email_address':     'email_address_blur',
        'blur #password':          'password_blur',
        'click #register':         'register'
      },

      initialize: function () {
        console.log('in initialize() of register-view.js');
        this.current_view = this;
        this.ENTER_KEY = 13;
      },

      render: function () {
        console.log('in register-view.js and render()');
        this.$el.html(this.template());

        this.$first_name =    this.$('#first_name');
        this.$last_name =     this.$('#last_name');
        this.$phone_number =  this.$('#phone_number');
        this.$email_address = this.$('#email_address');
        this.$password =      this.$('#password');

        this.registration_details = {};

        return this;
      },

      first_name_keypress: function (event) {
        console.log('in first_name_keypress');
      },

      last_name_keypress: function (event) {
        console.log('in last_name_keypress');
      },

      phone_number_keypress: function (event) {
        console.log('in phone_number_keypress');
      },

      email_address_keypress: function (event) {
        console.log('in email_address_keypress');
      },
 
      password_keypress: function (event) {
        console.log('in password_keypress');

        if (event.which === this.ENTER_KEY) {
          console.log('in password_keypress and ENTER_KEY was pressed');
        
          //add the contents of password input to data to be sent to register
          //then call the register api route
          this.close_input_field(this.$password, 'password');
          this.register();
        }
      },

      first_name_blur: function (event) {
        console.log('in first_name_blur');
        this.close_input_field(this.$first_name, 'first_name');
        return;
      },

      last_name_blur: function (event) {
        console.log('in last_name_blur');
        this.close_input_field(this.$last_name, 'last_name');
        return;
      },

      phone_number_blur: function (event) {
        console.log('in phone_number_blur');
        this.close_input_field(this.$phone_number, 'phone_number');
        return;
      },

      email_address_blur: function (event) {
        console.log('in email_address_blur');
        this.close_input_field(this.$email_address, 'email_address');
        return;
      },

      password_blur: function (event) {
        console.log('in password_blur');
        this.close_input_field(this.$password, 'password');
        return;
      },

      close_input_field: function(input_element, attribute) {
        console.log('in close_input_field');
        console.dir(input_element);
        console.log('attribute: ' + attribute);

        var value = input_element.val().trim();
        this.registration_details[attribute] = value;
        
        return;
      },

      register: function () {
        console.log('in register function');
        var self = this;

        //if any elements have an 'has-error' class, remove the class before submitting 
        //for registration. if not, then if they resubmit registration and get a field
        //wrong again, the UI will not update to show which fields are now good, and
        //which are not.
        var form_group_array = self.$('.form-group');
        //console.log(form_group_array);
        if (form_group_array.hasClass('has-error')) {
          form_group_array.removeClass('has-error');
        }
        

        $.ajax({
          url: '/api/users/register',
          type: 'POST',
          data: self.registration_details,
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: in ajax success callback');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.success === true) {
              console.log('SUCCESS: registration success.'); 

              //create the successful registation view
              var successful_registration = new SuccessfulRegistration();
              self.show_view('#featureContent', successful_registration);
              self.display_account_tab(true);
              self.switch_log_button('#logout_header','#login_header');
              window.scrollTo(0, 350);

            } 
            if (data.errors.duplicate_email === true ) { 
              console.log('ERROR: DUPLICATE_EMAIL');
              //data.success is false from here on.
              //we have a duplication email address error (duplicate key)

              var $email_address = $('#email_address');

              $email_address.parent('.form-group').addClass('has-error');
              //$email_address.attr('placeholder', 'Address already taken');

            }
            if (!self.isEmpty(data.errors.validation_errors)) {
              //we have input validation errors, an Array of objects.
              console.log('VALIDATION ERROR');
              console.dir(data.errors.validation_errors); 

              for (var key in data.errors.validation_errors) {
                //console.log(data.errors.validation_errors[key].param);
                //console.log(data.errors.validation_errors[key].msg);

                var id_of_bad_input = '#' + data.errors.validation_errors[key].param; 
                console.log(id_of_bad_input);
                $(id_of_bad_input).parent('.form-group').addClass('has-error'); 
                
              }
            }
            
          },
          error: function (jqXHR, textStatus, err) {
            console.log('ERROR: ajax error callback: registration error.'); 
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(err);
            //call it an internal error. re render the view to get them to submit again
            self.render();

          }
        });
      },

      isEmpty: function (obj) {
        console.log('in isEmpty() function');
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false; //obj is NOT empty
          }
        }
        return true; //obj IS empty

      },


      switch_log_button: function (element_to_show, element_to_hide) {
        $(element_to_hide).css('display', 'none');
        $(element_to_show).css('display', 'block');
      },

      display_account_tab: function (logic) {
        if (logic) {
          $('#account').css('display', 'block');
        } else {
          $('#account').css('display', 'none');
        }
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
    return RegisterView;
  }
);
