// site/js/views/purchase-with-credit-card-from-value-view.js


define([
    'backbone',
    'braintree',
    'text!tpl/PurchaseWithCreditCardFromVaultView.html',
    'views/checkout-view',
    'views/credit-card-details-view',
    'text!tpl/SuccessfulUserFeedback.html',
    'cookie_util',
    'text!tpl/NegativeUserFeedback.html'
  ],
  function (Backbone, 
            Braintree, 
            PurchaseWithCreditCardFromVaultHTML, 
            CheckoutView,
            CreditCardDetailsView,
            SuccessfulUserFeedbackHTML,
            CookieUtil,
            NegativeUserFeedbackHTML) 
  {

  var PurchaseWithCreditCardFromVaultView = Backbone.View.extend({
    tagName: 'div',

    className: 'view_purchase_with_cc_from_vault_details',

    template: _.template(PurchaseWithCreditCardFromVaultHTML),

    events: {
      'keypress #cc_number':                         'cc_number_update',
      'keypress #cc_cvv':                            'cc_cvv_update',
      'keypress #cc_month':                          'cc_month_update',
      'keypress #cc_year':                           'cc_year_update',
      'blur #cc_number':                             'cc_number_blur',
      'blur #cc_cvv':                                'cc_cvv_blur',
      'blur #cc_month':                              'cc_month_blur',
      'blur #cc_year':                               'cc_year_blur',
      'click #submit':                               'submit',
      'click #during_checkout_edit_cc_details':      'edit_cc_details',
      'click #submit_updated_cc':                    'submit_updated_cc',
      'mouseover #submit':                           'select_proceed',
      'mouseout #submit':                            'deselect_proceed',
      'mouseover #during_checkout_edit_cc_details':  'select_proceed',
      'mouseout #during_checkout_edit_cc_details':   'deselect_proceed',
      'mouseover #submit_updated_cc':                'select_proceed',
      'mouseout #submit_updated_cc':                 'deselect_proceed',
      'click #cancel_update_cc':                     'cancel_update_cc'
    },


    select_proceed: function (e) {
      this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
    },

    deselect_proceed: function (e) {
      this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
    },



    initialize: function () {
      console.log('in initialize() of purchase-with-credit-card-from-vault-view.js');

      this.current_view = this;
      this.new_cc_details = {};

      //IMPORTANT: need to bind all methods to use the view instance as this variable
      _.bindAll(this);

      //instatiate the braintree object. needed in order to encrypt the cc details
      this.braintree = Braintree.create("MIIBCgKCAQEAwJo0HGLwcnHbj+LCBWEvxjjfZYTwoJuNvR34CevWwu71HeQ7s6kD9FuzK3nHFL0oA2/HchnhmWh4ilFzYq3/4U+hNLJwdG++MlZxQ9KlfLX2ROatmuOyIcD1mXKlKAEhuxU4OnTBnMByyzhy3Hz/9omOGWK0bjmSKkZabjwiqgs0E2VLeRaTERxWPPAKEPgKfiFjiYdOyYbXvvOtRU6kMze6ZoYnF098/RkrJuL8a+tn6otmQHJOvvLobJf0PYTH1YKEgx7JGhTQ0tvewd/gz4Lg8GMknM0HkGWaqtpLzeqahDGfik0PZQfWArvVQofOLVito0yY1Ck6G2A8mrjb/QIDAQAB");
  
      console.log('braintree object:');
      console.dir(this.braintree);

      //CAUSES A BUG. see router.js Backbone.on('router:set_current_view')
      //tell router to set its this.currentView variable to this view. need to do this so
      //router cleans up this view if user so happens to stop the purchase process and
      //clicks somewhere else (say a link in navbar)
      //Backbone.trigger('router:set_current_view', this);
      
    },

    render: function () {
      console.log('in purchase-with-credit-card-from-vault-view.js and render()');
      console.log('this.model:');
      console.dir(this.model);

      this.$el.html(this.template(this.model.toJSON()));

      //this.$('#enter_cc_details').css('display', 'none');
 
      //calculate the total to display to the client site page.
      //actual billing total will be the transaction_amount, which is calculated
      //server side using gigModel's price. this is done this way to prevent someone
      //who hacks client side order model to change the price from actually submitting
      //the erroneous total to the payment gateway.
      //client side display is needed to tell the user again actually how much they're
      //going to be charged. 
      //if everything matches up, both the server side transaction_amount and the 
      //client side total should MATCH.
      var total  = this.model.get('number_of_tickets')
        * this.model.get('ticket_price')

      //actually display the total amount to the user
      this.$('#summary_total_amount').html(total);

      //cache the input elemnts using jQuery
      this.$cc_number =  this.$('#cc_number');
      this.$cc_cvv =     this.$('#cc_cvv');
      this.$cc_month =   this.$('#cc_month');
      this.$cc_year =    this.$('#cc_year');


      this.get_billing_info();

      return this;
    },


    get_billing_info: function () {

      $.ajax({
        'url': '/api/users/account/billing_info/',
        'type': 'GET',
        success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: user cc details: ');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);
   
            self.$('#cc_masked_number').html(data.masked_number);     
            self.$('#cc_expiration_date').html(data.expiration_date);     

        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('ERROR: user cc details: ');
          console.dir(jqXHR);
          console.log(textStatus);
          console.dir(errorThrown);
 
        }
      });


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
   
      var field_to_set = {};

      var value = input_element.val().trim();
      var encrypted_value = this.braintree.encrypt(value);
      
      field_to_set[model_attribute] = encrypted_value;
 
      //set the field in this.model 
      this.model.set(field_to_set);
      this.new_cc_details[model_attribute] = encrypted_value;

      console.log('value entered into field, ' + model_attribute + ' is ' 
        + value);
      console.log('encrpyted value of entered into field, ' + model_attribute + ' is ' 
        + encrypted_value);

      return;
    },


    submit: function () {
      console.log('submitting cc details');
      console.log('this.model: ');
      console.dir(this.model);

      //TODO: stop click event from registering this function handler.
      //so user doesnt resend an order whilst the previous ajax call is pending
      //$(this.el).find('#submit').off('click');

      //unbind the listener to stop resending order
      //this.$('#submit').off('click');

      var self = this;
      
      //check to see if the cookie for reserving tickets has timed out
      if (!CookieUtil.get('reserve_tickets')) {
        //reservation TIMEDOUT

        //TODO implement further
        alert('TICKET RESERVATION EXPIRED: Please start again.');
        return;

      } else {
        //reservation is still VALID

        //make http PUT /api/orders/:id request
        this.model.save({}, 
          {
            error: function (model, xhr) {
              console.log('ERROR in ajax call to save/update the model/order');
              console.dir(model);
              console.dir(xhr);

              self.render();


            },
            success: function (model,response) {
              console.log('SUCCESS in ajax call to save/update the model/order');
              console.dir(model);
              console.dir(response);


              if (response.errors) {
                //we have errors
                console.log('ERRORS: we have errors in processing the order');
               
                if (!_.isEmpty(response.errors.validation_errors)) {
                  //we have validation errors
                  console.log('VALIDATION_ERROR: data posted created validation errors');
                  self.render();
                  return;

                } else if (!_.isEmpty(response.errors.internal_errors)) {
                  //we have internal errors
                  console.log('INTERNAL_ERROR: data posted created internal errors');
                  alert('ERROR: there was a problem submitting your order: ' + 
                         response.errors.internal_errors.error);
                  self.render();
                  return;

                }     
                
                return;
              }
  
              //handles all the possible cc status responses
              self.handle_cc_statuses(response, model);
  
            }
          }
        );
      }
    },



    //TODO: flesh this out further
    handle_cc_statuses: function (response, model) {
      var status = response.transaction_status;
    
      if (status === 'submitted_for_settlement') {
        console.log('transaction_status: ' + status);


        //emit the order:finished CUSTOM_EVENT
        Backbone.trigger('order:finished');


        //stop the reserve_tickets counter which will stop order process if reached
        clearInterval(this.interval_id);  
        var checkout_view = new CheckoutView({model: model});
        this.show_view('#featureContent', checkout_view);
        window.scrollTo(0,350);

      } else if (status === 'authorized') {
        console.log('transaction_status: ' + status);
        this.render();

      } else {
        console.log('transaction_status: ' + status);
        this.render();
      }   

    },



    edit_cc_details: function () {

        //hide the old submit button
        this.$('#submit').css('display', 'none');
   
        //show the update cc details UI
        this.$('#during_checkout_update_cc_details').css('display', 'block'); 
        
        //temporarily hide the vault cc UI
        this.$('#vault_cc').css('display', 'none');
    },


    cancel_update_cc: function () {
        //show the old submit button
        this.$('#submit').css('display', 'block');

        //hide the update cc details UI
        this.$('#during_checkout_update_cc_details').css('display', 'none'); 
        
        //show the vault cc UI again
        this.$('#vault_cc').css('display', 'block');



    },  



    submit_updated_cc: function () {
      console.log('you just clicked submit_updated_cc div');
 
      var self = this;

        $.ajax({
          url: '/api/users/change_cc_details/',
          type: 'POST',
          data: self.new_cc_details,
          success: function (data, textStatus, jqXHR) {
              console.log('SUCCESS: changed the cc details for the user');
              console.dir(data);
              console.log(textStatus);
              console.dir(jqXHR);
    
              //WHY did i do this again??? is it really essential for the order?
              //you already have the user _id 
              //self.model.set({'braintree_customer_id': data.result.customer.id});

              if (!data.success) {
                //there were errors
 
                //TODO: error handling
                self.render();
                self.$('#vault_cc')
                  .prepend(_.template(NegativeUserFeedbackHTML)({'error':
                  'could not change credit card. Try again.'}));

                return;
              } else {
                //successful cc update
                //display the vault_cc with the new cc details
                self.$('#vault_cc').css('display','block');
                self.$('#cc_masked_number').html(data.result.masked_number);     
                self.$('#cc_expiration_date').html(data.result.expiration_date);     
                self.$('#during_checkout_update_cc_details').css('display', 'none');
                self.$('#submit').css('display', 'block');
                self.$('#vault_cc')
                  .prepend(_.template(SuccessfulUserFeedbackHTML)({'success':
                  'Updated credit card'}));

              }

              //submit for payment
              //self.submit();
  
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: could not change the cc details for the user');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);
   
          },
        });
    },



    show_view: function (selector, view) {
      console.log('in showView of credit-card-details-view.js');
      if (this.current_view) {
        this.current_view.close();
      }
      $(selector).html(view.render().el);
      this.current_view = view;
      return view;
    } 

  });
  return PurchaseWithCreditCardFromVaultView;
  }
);
