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
        'click #register':         'register',
        'mouseover #login':        'select_proceed',
        'mouseout #login':         'deselect_proceed',
        'mouseover #register':     'select_proceed',
        'mouseout #register':      'deselect_proceed'
      },


      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },
 
 
      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
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

            //if any elements have an 'has-error' class, remove the class 
            //before submitting for registration. if not, then if they resubmit 
            //registration and get a field wrong again, the UI will not update to 
            //show which fields are now good, and which are not.
            var form_group_array = self.$('.form-group');
            //console.log(form_group_array);
            if (form_group_array.hasClass('has-error')) {
              form_group_array.removeClass('has-error');
            }

            if (data.user_authenticated) {
              //go on to number of tickets view
              self.current_view = self;
              var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
              self.show_view('#featureContent', numberOfTicketsView); 

              //toggle login -> to -> logout in header view
              self.switch_log_button('#logout_header', '#login_header'); 
             
              //show the user account tab
              self.display_account_tab(true);

              window.scrollTo(0, 350);
            } 
            if (!_.isEmpty(data.errors.internal_errors)) {
              //there are internal errors
              if (data.errors.internal_errors.error &&
                  data.errors.internal_errors.error === 'invalid_password')
              {
                console.log('INVALID PASSWORD');
                self.$('#password').parent('.form-group').addClass('has-error');
              } else {
                //internal error - could be no user for that email address??
                self.render();
              }              
            }
          },
          error: function (jqXHR, textStatus, err) {
            console.log('ERROR: POST /api/users/login');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(err);
            //treat this as an internal error.
            self.render();
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

      /*
      isEmpty: function (obj) {
        console.log('in isEmpty() function');
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false; //obj is NOT empty
          }
        }
        return true; //obj IS empty

      },  
      */

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
