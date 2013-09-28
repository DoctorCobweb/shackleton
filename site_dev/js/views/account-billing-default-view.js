// site/js/views/account-billing-default-view.js
// display the default billing info for a user => no cc details yet.

define([
    'backbone',
    'text!tpl/AccountBillingDefault.html',
    'braintree',
    'views/account-billing-view'
  ], 
  function (Backbone, AccountBillingDefaultHTML, Braintree,
            AccountBillingView) {
    var AccountBillingDefaultView = Backbone.View.extend({
      tagName: 'div',
 
      className: 'account_billing_default_details',

      template: _.template(AccountBillingDefaultHTML),

      events: {
       'keypress #cc_number':       'cc_number_update',
       'keypress #cc_cvv':          'cc_cvv_update',
       'keypress #cc_month':        'cc_month_update',
       'keypress #cc_year':         'cc_year_update',
       'blur #cc_number':           'cc_number_blur',
       'blur #cc_cvv':              'cc_cvv_blur',
       'blur #cc_month':            'cc_month_blur',
       'blur #cc_year':             'cc_year_blur',
       //'click #change_cc':          'change_cc',
       'click #submit':             'submit'

      },

      initialize: function () {
        console.log('in initialize() of account-billing-default-view.js');
        this.current_view = this;

        console.log('options:');
        console.dir(this.options);

        this.braintree = Braintree.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB");

        console.log('braintree object');
        console.dir(this.braintree);


      },


      render: function () {
        console.log('in account-billing-default-view.js and render()');

        this.$el.html(this.template());

        //cache the input elemnts using jQuery
        this.$cc_number =  this.$('#cc_number');
        this.$cc_cvv =     this.$('#cc_cvv');
        this.$cc_month =   this.$('#cc_month');
        this.$cc_year =    this.$('#cc_year');  

        this.field_to_set = {};

        return this;
      },

      cc_number_update: function (e) {
        console.log('cc_number');
        return;
      },
  
  
      cc_cvv_update: function (e) {
        console.log('cc_cvv');
        return;
      },
  
  
      cc_month_update: function (e) {
        console.log('cc_month');
        return;
      },
  
  
      cc_year_update: function (e) {
        console.log('cc_year');
        return;
      },
  
  
      cc_number_blur: function (e) {
        console.log('cc_number_blur');
        this.close_input_field(this.$cc_number, 'cc_number');
        return;
      },
  
  
      cc_cvv_blur: function (e) {
        console.log('cc_cvv_blur');
        this.close_input_field(this.$cc_cvv, 'cc_cvv');
        return;
      },
  
  
      cc_month_blur: function (e) {
        console.log('cc_month_blur');
        this.close_input_field(this.$cc_month, 'cc_month');
        return;
      },
  
  
      cc_year_blur: function (e) {
        console.log('cc_year_blur');
        this.close_input_field(this.$cc_year, 'cc_year');
        return;
      },



      close_input_field: function (input_element, model_attribute) {
        console.log('close_input_field()');
        console.dir(input_element);
        console.log('model_attribute: ' + model_attribute);
   
   
        var value = input_element.val().trim();
        var encrypted_value = this.braintree.encrypt(value);
   
        this.field_to_set[model_attribute] = encrypted_value;
   
        //set the field in this.model
        //this.model.set(field_to_set);
   
        console.log('value entered into field, ' + model_attribute + ' is '
          + value);
        console.log('encrpyted value of entered into field, ' + model_attribute + ' is '
          + encrypted_value);
   
        return;
      },


      submit: function () {

        var self = this;
        console.log('in submit handler');
        console.dir(this.field_to_set);

        $.ajax({
          url: '/api/users/change_cc_details/',
          type: 'POST',
          data: self.field_to_set,
          success: function (data, textStatus, jqXHR) {
              console.log('SUCCESS: submitted the cc to braintree');
              console.dir(data);
              console.log(textStatus);
              console.dir(jqXHR);
         
              /*
              if (data.errors) {
                alert('data entry errors returned. see console.log');
                console.log('data entry errors returned.');
                console.dir(data);
                self.render();
              } else {
                var billing_view = new AccountBillingView({billing_data: data});
                console.log('billing_view is: ');
                console.dir(billing_view);
                self.show_view('#account_main', billing_view);
              }
              */

              var billing_view = new AccountBillingView({billing_data: data});
              console.log('billing_view is: ');
              console.dir(billing_view);
              self.show_view('#account_main', billing_view);

          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: failed setting the braintree cc in vault');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);
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
    return AccountBillingDefaultView;
  }
);
