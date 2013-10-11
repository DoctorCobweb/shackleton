// site/js/views/beta-login-view.js


define([
    'backbone',
    'text!tpl/BetaLoginView.html',
    'views/real-front-page-view',
    'views/header-view',
    'views/banner-view'
  ],
  function (Backbone, BetaLoginHTML, 
            RealFrontPageView, HeaderView, BannerView) {
    var LoginView = Backbone.View.extend({
      tagName: 'div',

      className: 'view_beta_login_details col-md-12',

      template: _.template(BetaLoginHTML),

      events: {
        'keypress #username':      'beta_username_update',
        'keypress #password':      'beta_password_update',
        'blur #username':          'beta_username_blur',
        'blur #password':          'beta_password_blur',
       //'click #login':            'login'
      },

      initialize: function () {
        console.log('in initialize() of beta-login-view.js');
        this.ENTER_KEY = 13;

      },

      render: function () {
        console.log('in beta-login-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template());

        //cache the input elements
        this.$username = this.$('#username');
        this.$password = this.$('#password');

        console.dir(this.$username);
        console.dir(this.$password);
        console.dir(this);

        //put this declaration in render() because render() is called after
        //a failed login attempt. if you dont reset it here, the previous attempt 
        //input vals are carried over to the new attempt => bug.
        this.field_to_set = {};

        return this;
      },

      beta_username_update: function (e) {
        console.log('beta_email_address_update');
      },

      beta_password_update: function (e) {
        console.log('beta_password_update');
       
        if (e.which === this.ENTER_KEY) {
          this.close_input_field(this.$password, 'password');
          this.login();
        }

      },

      beta_username_blur: function (e) {
        console.log('beta_username_blur');
        this.close_input_field(this.$username, 'username');
        return;

      },

      beta_password_blur: function (e) {
        console.log('beta_password_blur');
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
          url: '/api/users/beta_login',
          type: 'POST',
          data: self.field_to_set,
          success: function (data, textStatus, jqXHR) {
            console.log( 'SUCCESS: POST /api/users/beta_login');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);


            if (data.beta_user_authenticated) {
              
              //$('#the_overbearer').css('background-color', '#EE6D08');
              self.options.router_ref.test_router_ref();
             
              var real_front_page = new RealFrontPageView();
              self.options.router_ref.change_private_beta(false); 
              console.log('changed this.current_view to: ');
              console.log(self.show_view('body', real_front_page)); 

              new HeaderView();
              new BannerView();

              self.options.router_ref.navigate('#/', {trigger:true});
              
            } else {
              self.render();
              
            }
 
 
          },
          error: function (jqXHR, textStatus, err) {
            console.log('ERROR: POST /api/users/beta_login');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(err);
            //treat this as an internal error.
            self.render();
          }
        });

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
    return LoginView;
  }
);
