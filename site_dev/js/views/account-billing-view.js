// site/js/views/account-billing-view.js
// display the billing detail the  user has.

define([
    'backbone',
    'text!tpl/AccountBilling.html',
    'braintree'
  ], 
  function (Backbone, AccountBillingHTML, Braintree) {
    var AccountBillingView = Backbone.View.extend({
      tagName: 'div',
 
      className: 'account_billing_details',

      template: _.template(AccountBillingHTML),

      events: {
       'keypress #cc_number':       'cc_number_update',
       'keypress #cc_cvv':          'cc_cvv_update',
       'keypress #cc_month':        'cc_month_update',
       'keypress #cc_year':         'cc_year_update',
       'blur #cc_number':           'cc_number_blur',
       'blur #cc_cvv':              'cc_cvv_blur',
       'blur #cc_month':            'cc_month_blur',
       'blur #cc_year':             'cc_year_blur',
       'click #account_change_cc':  'change_cc',
       'click #submit_new_cc':      'submit'

      },

      initialize: function () {
        console.log('in initialize() of account-billing-view.js');
        this.current_view = this;

        console.log('options:');
        console.dir(this.options);

        this.braintree = Braintree.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB");

        console.log('braintree object');
        console.dir(this.braintree);

        this.field_to_set = {};
        this.ENTER_KEY = 13;

      },


      render: function () {
        console.log('in account-billing-view.js and render()');

        //this.$el.html(this.template(this.model.toJSON()));
        this.$el.html(this.template(this.options.billing_data));
        //this.get_billing_info();
       
        //cache the input elemnts using jQuery
        this.$cc_number =  this.$('#cc_number');
        this.$cc_cvv =     this.$('#cc_cvv');
        this.$cc_month =   this.$('#cc_month');
        this.$cc_year =    this.$('#cc_year');  

        return this;
      },


      re_render: function (updated_values) {
        console.log('in account-billing-view.js and re_render()');

        this.$el.html(this.template(updated_values));
       
        //cache the input elemnts using jQuery
        this.$cc_number =  this.$('#cc_number');
        this.$cc_cvv =     this.$('#cc_cvv');
        this.$cc_month =   this.$('#cc_month');
        this.$cc_year =    this.$('#cc_year');  

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
  
        if (e.which === this.ENTER_KEY) {
          this.close_input_field(this.$cc_year, 'cc_year');
          this.submit();
        }

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


     
      change_cc: function () {
        console.log('change_cc handler');

        //hide the change cc details button 
        this.$('#account_change_cc').css('display', 'none');

        //show the change_cc view by making display:block
        //the view comes with a submit button, which should make the ajax call below
        this.$('#account_enter_new_cc_details').css('display', 'block'); 


      },

      submit: function () {
        var self = this;

        //check if any input fields are empty. if so then warn them with red borders
        //around the relevent inputs. then return.
        console.log(this.$cc_number.val().trim() === '');

        if (this.$cc_number.val().trim() === '') {
          this.$cc_number.addClass('required_field');
          //this.$cc_number.css('border', '#cc5152');
          return;
        }
        if (this.$cc_cvv.val().trim() === '') {
          this.$cc_number.addClass('required_field');
          //this.$cc_cvv.css('border', '#cc5152');
          return;
        }
        if (this.$cc_month.val().trim() === '') {
          this.$cc_number.addClass('required_field');
          //this.$cc_month.css('border', '#cc5152');
          return;
        }
        if (this.$cc_year.val().trim() === '') {
          this.$cc_number.addClass('required_field');
          //this.$cc_year.css('border', '#cc5152');
          return;
        }


        $.ajax({
          url: '/api/users/change_cc_details/',
          type: 'POST',
          data: self.field_to_set,
          success: function (data, textStatus, jqXHR) {
              console.log('SUCCESS: submitted the cc to braintree');
              console.dir(data);
              console.log(textStatus);
              console.dir(jqXHR);

              self.$('#account_enter_new_cc_details').css('display', 'none'); 

              var updated_card = {};
              updated_card.masked_number = data.customer.creditCards[0].maskedNumber;
              updated_card.last_4 = data.customer.creditCards[0].last4;
              updated_card.expiration_date = data.customer.creditCards[0].expirationDate;             
              //self.$el.html(self.template(updated_card));
              self.re_render(updated_card);
 
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
    return AccountBillingView;
  }
);
