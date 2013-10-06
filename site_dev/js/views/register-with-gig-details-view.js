// site/js/views/register-with-gig-details-view.js


define([
    'backbone',
    'text!tpl/RegisterWithGigDetailsView.html',
    'models/user-model',
    'views/number-of-tickets-view'
  
  ],
  function (Backbone, RegisterWithGigDetailsHTML, 
            User, NumberOfTicketsView) {
    var RegisterWithGigDetailsView = Backbone.View.extend({
      tagName: 'div',

      className: 'register_with_gig_details',

      template: _.template(RegisterWithGigDetailsHTML),

      events: {
        'keypress #first_name':    'first_name_keypress',
        'keypress #last_name':     'last_name_keypress',
        'keypress #phone_number':  'phone_number_keypress',
        'keypress #email_address': 'email_address_keypress',
        'keypress #password':      'password_keypress',
        'blur #first_name':         'first_name_blur',
        'blur #last_name':         'last_name_blur',
        'blur #phone_number':      'phone_number_blur',
        'blur #email_address':     'email_address_blur',
        'blur #password':          'password_blur',
        'click #register':         'register'
      },

      initialize: function () {
        console.log('in initialize() of register-with-gig-details-view.js');

       /*
        *  this.model is still the gig details attributes
        */
        console.dir(this.model);


        this.current_view = this;
        this.ENTER_KEY = 13;

      },

      render: function () {
        console.log('in register-with-gig-details-view.js and render()');
        this.$el.html(this.template(this.model.toJSON()));

        this.$first_name = this.$('#first_name');
        this.$last_name = this.$('#last_name');
        this.$phone_number = this.$('#phone_number');
        this.$email_address = this.$('#email_address');
        this.$password = this.$('#password');

        this.registration_details = {};

        return this;
      },

      first_name_keypress: function (event) {
        console.log('in first_name_keypress');
        return;
      },

      last_name_keypress: function (event) {
        console.log('in last_name_keypress');
        return;
      },

      phone_number_keypress: function (event) {
        console.log('in phone_number_keypress');
        return;
      },

      email_address_keypress: function (event) {
        console.log('in email_address_keypress');
        return;
      },
 
      password_keypress: function (event) {
        console.log('in password_keypress');

        if (event.which === this.ENTER_KEY) {
          console.log('in password_keypress and ENTER_KEY was pressed');

          this.close_input_field(this.$password, 'password');
          this.register();
        }

        return;
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

        $.ajax({
          url: '/api/users/register',
          type: 'POST',
          data: self.registration_details,
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: in ajax request');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.errors) {
              alert('ASSERTION ERRORS: invalid user input');
              console.log('ASSERTION ERRORS: invalid user input');
              console.dir(data);
              //self.render();
            } else if (data.registration_success === true) {
              console.log('SUCCESS: registration success.'); 
              self.switch_log_button('#logout_header', '#login_header');
              var number_of_tickets_view = new NumberOfTicketsView({model: self.model});
              self.show_view('#featureContent', number_of_tickets_view);
              self.display_account_tab(true);
              window.scrollTo(0, 350);
            } else {
              console.log('POST /api/users/register did NOT return ' + 
                          'registration_success === true');
              console.log('ERROR in registration:');
              console.dir(data);
              self.render();
            }
            
          },
          error: function (jqXHR, textStatus, err) {
            console.log('ERROR: registration success.'); 
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(err);

          }
        });
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
    return RegisterWithGigDetailsView;
  }
);
