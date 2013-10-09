// site/js/views/account-billing-view.js
// display the billing detail the  user has.

define([
    'backbone',
    'text!tpl/AccountBilling.html',
    'braintree',
    'text!tpl/UserFeedback.html'
  ], 
  function (Backbone, AccountBillingHTML, Braintree, UserFeedbackHTML) {
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
        this.$('#account_billing_change_cc').css('display', 'none');

        //show the change_cc view by making display:block
        //the view comes with a submit button, which should make the ajax call below
        this.$('#account_billing_update_cc_details').css('display', 'block'); 

        var $user_feedback = self.$('#account_billing_credit_card > .user_feedback');
        //also close the successful update div if it is showing
        if ($user_feedback.css('display') == 'block') {
          $user_feedback.css('display', 'none');
        }


      },

      submit: function () {
        var self = this;


        $.ajax({
          url: '/api/users/change_cc_details/',
          type: 'POST',
          data: self.field_to_set,
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: submitted the cc to braintree');
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



            var $user_feedback = self.$('#account_billing_credit_card > .user_feedback');
            //also close the successful update div if it is showing
            if ($user_feedback.css('display') == 'block') {
              $user_feedback.css('display', 'none');
            }





            if (data.success === false) {
              if (!_.isEmpty(data.errors.validation_errors)) {
                //we have validation errors due to bad user input. note: this is not
                //from braintree api returning validation errors, but from express-
                //validator module first checking if input is empty etc
                console.log('VALIDATION ERRORS');
     


                //loop through the Array of validation errors, set to red for error 
                //input
                for (var key in data.errors.validation_errors) {
                  var id_of_bad_input = '#' + data.errors.validation_errors[key].param;
                  console.log(id_of_bad_input);
                  $(id_of_bad_input).parent('.form-group').addClass('has-error');
                }
                return;
              }
              if (!_.isEmpty(data.errors.internal_errors)) {
                //we have internal errors
                console.log('INTERNAL ERRORS');
               
                //TODO: implement this more
                //more user feedback needed
                self.render();

                return;
              }
              if (!_.isEmpty(data.errors.braintree_errors)) {
                //we have braintree errors. could be 
                //1. from validation of cc field,
                //2. gatway rejected
                //3. gateway busy
                //4. etc...
                console.log('BRAINTREE ERRORS');
                console.dir(data.errors.braintree_errors);
                //TODO: implement further
                //more user feedback needed
                self.render();

                return;
              }
            } else {
              //data.success === true; // true
              //SUCCESSSFUL CC details update
              console.log('SUCCESSFUL CC DETAILS UPDATE');

              //hide the update cc details ui form stuff
              self.$('#account_billing_update_cc_details').css('display', 'none'); 

              var _card = {};
              _card.masked_number = data.result.customer.creditCards[0].maskedNumber;
              _card.last_4 = data.result.customer.creditCards[0].last4;
              _card.expiration_date = data.result.customer.creditCards[0].expirationDate;

              //self.$el.html(self.template(updated_card));

              //then re-render the UI
              self.re_render(_card);
              self.$('#account_billing_credit_card')
                .prepend(_.template(UserFeedbackHTML));

              window.scrollTo(0, 350);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('ERROR: failed setting the braintree cc in vault');
          console.dir(jqXHR);
          console.log(textStatus);
          console.dir(errorThrown);

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
    return AccountBillingView;
  }
);
