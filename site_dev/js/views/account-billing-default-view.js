// site/js/views/account-billing-default-view.js
// display the default billing info for a user => no cc details yet.

define([
    'backbone',
    'text!tpl/AccountBillingDefault.html',
    'braintree',
    'views/account-billing-view',
    'text!tpl/SuccessfulUserFeedback.html'
  ], 
  function (Backbone, AccountBillingDefaultHTML, Braintree,
            AccountBillingView, SuccessfulUserFeedbackHTML) {
    var AccountBillingDefaultView = Backbone.View.extend({
      tagName: 'div',
 
      className: 'view_account_billing_default_details',

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
       'click #submit':             'submit',
       'mouseover #submit':         'select_proceed',
       'mouseout #submit':          'deselect_proceed'

      },


      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },


      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
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


            //if any elements have an 'has-error' class, remove the class
            //before submitting for registration. if not, then if they resubmit
            //registration and get a field wrong again, the UI will not update to
            //show which fields are now good, and which are not.
            var form_group_array = self.$('.form-group');
            //console.log(form_group_array);
            if (form_group_array.hasClass('has-error')) {
              form_group_array.removeClass('has-error');
            }

            var query = '#account_billing_new_cc_details > .successful_user_feedback'; 
            var $successful_user_feedback = self.$(query);

            //also close the successful update div if it is showing
            if ($successful_user_feedback.css('display') == 'block') {
              $successful_user_feedback.css('display', 'none');
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
              //self.$('#account_billing_update_cc_details').css('display', 'none');

              var billing_view = new AccountBillingView({billing_data: data.result});
              console.log('billing_view is: ');
              console.dir(billing_view);
              self.show_view('#account_main', billing_view);

              //display success: this time we need to set it on the new billing_view!
              billing_view.$('#account_billing_credit_card')
                .prepend(_.template(SuccessfulUserFeedbackHTML)({'success':'Updated billing details'}));

              window.scrollTo(0, 350);
            } 

          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: failed setting the braintree cc in vault');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);

            //TODO: implement user feedback more
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
    return AccountBillingDefaultView;
  }
);
