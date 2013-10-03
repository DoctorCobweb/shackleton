// site/js/views/login-with-gig-details-view.js


define([
    'backbone',
    'text!tpl/LoginWithGigDetailsView.html',
    'views/number-of-tickets-view',
    'views/register-with-gig-details-view'
  ],
  function (Backbone, LoginWithGigDetailsHTML, 
    NumberOfTicketsView, RegisterWithGigDetailsView) {

    var LoginWithGigDetailsView = Backbone.View.extend({
      tagName: 'div',

      className: 'login_with_gig_details',

      template: _.template(LoginWithGigDetailsHTML),

      events: {
        'keypress #email_address': 'email_address_keypress',
        'keypress #password':      'password_keypress',
        'blur #email_address' :    'email_address_blur',
        'blur #password':          'password_blur',
        'click #login':            'login',
        'click #register':         'register'
      },

      initialize: function () {
        console.log('in initialize() of login-with-gig-details-view.js');


        /*
         *  this.model is still the gig details attributes
         */
        console.dir(this.model);

        this.ENTER_KEY = 13;

      },

      render: function () {
        console.log('in login-with-gig-details-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));

        this.$email_address = this.$('#email_address');
        this.$password = this.$('#password');

        this.login_details = {};

        return this;
      },

      email_address_keypress: function (e) {
        console.log('in email_address_keypress');
        return;
      },

      password_keypress: function (e) {
        console.log('in password_keypress');

        if (e.which === this.ENTER_KEY) {
          this.close_input_field(this.$password, 'password');
          this.login();
        }

        return;
      },

      email_address_blur : function (e) {
        console.log('in email_address_blur');
        this.close_input_field(this.$email_address, 'email_address');
        return;
      },

      password_blur : function (e) {
        console.log('in password_blur');
        this.close_input_field(this.$password, 'password');
        return;
      },

      close_input_field: function (input_element, attribute) {
        console.log('in close_input_field');
        console.dir(input_element);
        console.log('attribute: ' + attribute);

 
        //get the entered text from the input element
        var value = input_element.val().trim();

        //set the key/value pair for this element into the loginDetails obj
        this.login_details[attribute] = value;
   

        console.log('value entered into the attribute, ' + attribute + ', is '
          + value);
        console.dir(this.login_details);

        return; 
      },

      login: function () {
        console.log('in login function');
        var self = this;

        //try to log the user in
        $.ajax({ 
          url: '/api/users/login', 
          type: 'POST',    
          data: self.login_details, 
          success: function (data, textStatus, jqXHR) {
            console.log( 'SUCCESS: POST /api/users/login');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.errors) {
              alert('ASSERTION ERROR: invalid user input'); 
              console.log('ASSERTION ERROR: invalid user input'); 
              console.dir(data.errors);
              self.render();
            } else if (data.user_authenticated) {
              //go on to number of tickets view
              self.current_view = self;
              var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
              self.show_view('#featureContent', numberOfTicketsView); 

              //toggle login -> to -> logout in header view
              self.switch_log_button('#logout_header', '#login_header'); 
             
              //show the user account tab
              self.display_account_tab(true);
            } else {
              console.log('login failed, try again'); 
              console.dir(data);
              self.render();
            }

 
          },
          error: function (jqXHR, textStatus, err) {
            console.log('ERROR: POST /api/users/login');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(err);
          }
        });
      }, 

      register: function () {
        console.log('in register function');
        var self = this;

        var register_with_gig_details_view = new RegisterWithGigDetailsView({
          model: self.model}); 
        this.show_view('#featureContent', register_with_gig_details_view);


      },

      switch_log_button: function (element_to_show, element_to_hide) {
        $(element_to_hide).css('display', 'none');
        $(element_to_show).css('display', 'block');
      },
 
      show_view: function (selector, view) {
        console.log('in show_view()');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      },

      display_account_tab: function (logic) {
        if (logic) {
          $('#account').css('display', 'block');
        } else {
          $('#account').css('display', 'none');
        }
      }


    });
    return LoginWithGigDetailsView;
  }
);