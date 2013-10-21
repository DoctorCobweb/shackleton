// site/js/views/login-view.js


define([
    'backbone',
    'text!tpl/LoginView.html',
    'views/register-view',
    'views/user-details-view',
    'models/user-model'
  ],
  function (Backbone, LoginHTML, RegisterView, UserDetailsView, User) {
    var LoginView = Backbone.View.extend({
      tagName: 'div',

      className: 'view_login_details',

      template: _.template(LoginHTML),

      events: {
        'keypress #email_address': 'email_address_update',
        'keypress #password':      'password_update',
        'blur #email_address':     'email_address_blur',
        'blur #password':          'password_blur',
        'click #login':            'login', 
        'click #register':         'register',
        'mouseover #login':        'select_proceed',
        'mouseout #login':         'deselect_proceed'
      },


      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },
 
 
      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
      },



      initialize: function () {
        console.log('in initialize() of login-view.js');
        this.ENTER_KEY = 13;

      },

      render: function () {
        console.log('in login-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());

        //cache the input elements
        this.$email_address = this.$('#email_address');
        this.$password = this.$('#password');

        console.dir(this.$email_address);
        console.dir(this.$password);
        console.dir(this);

        //put this declaration in render() because render() is called after
        //a failed login attempt. if you dont reset it here, the previous attempt 
        //input vals are carried over to the new attempt => bug.
        this.field_to_set = {};

        return this;
      },

      email_address_update: function (e) {
        console.log('email_address_update');
        console.log(this.el);
        console.log(this.$el);
      },

      password_update: function (e) {
        console.log('password_update');
       
        if (e.which === this.ENTER_KEY) {
          this.close_input_field(this.$password, 'password');
          this.login();
        }

      },

      email_address_blur: function (e) {
        console.log('email_address_blur');
        this.close_input_field(this.$email_address, 'email_address');
        return;

      },

      password_blur: function (e) {
        console.log('password_blur');
        this.close_input_field(this.$password, 'password');
        return;
      },

      close_input_field: function (input_element, model_attribute) {
        console.log('close_input_field');
        console.dir(input_element);
        console.log('model_attribute: ' + model_attribute);

        //you could put client side encryption here if u wanted to
        //cipher password, email_addree values...

        var value = input_element.val().trim();
        this.field_to_set[model_attribute] = value;
        console.dir(this.field_to_set);
      },

      login: function () {
        console.log('in login event handler');
        console.dir(this.field_to_set);
        
        var self = this;


        
        //try to log the user in
        $.ajax({
          url: '/api/users/login',
          type: 'POST',
          data: self.field_to_set,
          success: function (data, textStatus, jqXHR) {
            console.log( 'SUCCESS: POST /api/users/login');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            //if any elements have an 'has-error' class, remove the class before 
            //submitting for registration. if not, then if they resubmit registration 
            //and get a field wrong again, the UI will not update to show which 
            //fields are now good, and which are not.
            var form_group_array = self.$('.form-group');
            //console.log(form_group_array);
            if (form_group_array.hasClass('has-error')) {
              form_group_array.removeClass('has-error');
            }
 
            if (data.user_authenticated) {
              //toggle login -> to -> logout in header view
              self.switch_log_button('#logout_header', '#login_header');
              self.display_account_tab(true);   
 
              //create a new user model, needed for the next view: UserDetailsView 
              var user_model = new User({_id: data.user_id});
              user_model.fetch({
                success: function (model, response) {
                  console.log('SUCCESS: fetched the user model');
                  console.dir(model); 
                  console.log(response); 

                  //after fetching the model from the server, create UserDetailsView
                  var user_details = new UserDetailsView({model: model});
                  self.show_view('#featureContent', user_details);
                  window.scrollTo(0, 350);
                },
                error: function (model, response) {
                  console.log('ERROR: in fetching the user model');
                  console.dir(model); 
                  console.log(response); 
                }
              });
            } 
            if (!_.isEmpty(data.errors.internal_errors)){
            //if (!self.isEmpty(data.errors.internal_errors)){
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


      register: function (event) {
        console.log('in register event handler');
        var register_view = new RegisterView ();
        this.show_view('#featureContent', register_view);
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
    return LoginView;
  }
);
