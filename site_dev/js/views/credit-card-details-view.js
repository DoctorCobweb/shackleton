// site/js/views/credit-card-details-view.js


define([
    'backbone',
    'braintree',
    'text!tpl/CreditCardDetailsView.html',
    'views/checkout-view',
    'text!tpl/SuccessfulUserFeedback.html',
    'text!tpl/NegativeUserFeedback.html',
    'cookie_util'
  ],
  function (Backbone, 
            Braintree, 
            CreditCardDetailsHTML, 
            CheckoutView,
            SuccessfulUserFeedbackHTML,
            NegativeUserFeedbackHTML,
            CookieUtil) 
  {

  var CreditCardDetailsView = Backbone.View.extend({
    tagName: 'div',

    //className: 'credit_card_details',
    className: 'view_credit_card_details',

    template: _.template(CreditCardDetailsHTML),

    events: {
      'keypress #cc_number':                         'cc_number_update',
      'keypress #cc_cvv':                            'cc_cvv_update',
      'keypress #cc_month':                          'cc_month_update',
      'keypress #cc_year':                           'cc_year_update',
      'blur #cc_number':                             'cc_number_blur',
      'blur #cc_cvv':                                'cc_cvv_blur',
      'blur #cc_month':                              'cc_month_blur',
      'blur #cc_year':                               'cc_year_blur',
      'click #submit_new_cc':                        'submit_new_cc',
      'click #submit_order':                         'submit_order',
      'click #during_checkout_edit_cc_details':      'edit_vault_cc',
      'mouseover #submit_new_cc':                    'select_proceed',
      'mouseout  #submit_new_cc':                    'deselect_proceed',
      'mouseover #submit_order':                     'select_proceed',
      'mouseout  #submit_order':                     'deselect_proceed',
      'mouseover #during_checkout_edit_cc_details':  'select_proceed',
      'mouseout  #during_checkout_edit_cc_details':  'deselect_proceed'
    },

    select_proceed: function (e) {
      this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
    },

    deselect_proceed: function (e) {
      this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
    },



    initialize: function () {
      console.log('in initialize() of credit-card-details-view.js');

      this.current_view = this;
      this.field_to_set = {};

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
      //Backbone.on('router:set_current_view', this);

    },

    render: function () {
      console.log('in credit-card-details-view.js and render()');

      this.$el.html(this.template(this.model.toJSON()));
 
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
   
      //var field_to_set = {};

      var value = input_element.val().trim();
      var encrypted_value = this.braintree.encrypt(value);
      
      this.field_to_set[model_attribute] = encrypted_value;
 
      //set the field in this.model 
      this.model.set(this.field_to_set);

      console.log('value entered into field, ' + model_attribute + ' is ' 
        + value);
      console.log('encrpyted value of entered into field, ' + model_attribute + ' is ' 
        + encrypted_value);

      return;
    },


    edit_vault_cc: function () {
      this.$cc_number.val('');
      this.$cc_cvv.val('');
      this.$cc_month.val('');
      this.$cc_year.val('');
      //hide the vault UI, hide the submit_order button, display to credit card for UI 
      this.$('#vault_cc').css('display', 'none');     
      this.$('#submit_order').css('display', 'none');
      this.$('#during_checkout_new_credit_card_details').css('display', 'block');

    },


    submit_new_cc: function () {
      console.log('submitting new cc details for verification');
      console.log('this.model: ');
      console.dir(this.model);

      var self = this;


      if (!CookieUtil.get('reserve_tickets')) {
        console.log('cannot submit order because cookie timedout'); 
        //TODO implement further
        alert('TICKET RESERVATION EXPIRED: Please start again.');
        return;
      }

      var $successful_user_feedback = self.$('#vault_cc > .successful_user_feedback');

      //also close the successful update div if it is showing
      if ($successful_user_feedback.css('display') == 'block') {
        $successful_user_feedback.css('display', 'none');
      }


      $.ajax({
        url: '/api/users/change_cc_details/',
        type: 'POST',
        data: self.field_to_set,
        success: function (data, textStatus, jqXHR) {
          console.log('SUCCESS: submitted new cc details');
          console.dir(data);
          console.log(textStatus);
          console.dir(jqXHR);


          if (!data.success) {
            //there were errors          
            //TODO: error handling
            self.render();
            self.$('#during_checkout_new_credit_card_details')
              .prepend(_.template(NegativeUserFeedbackHTML)({'error': 
              'could not save/verify credit card. Try again.'}))

            return;
          } else {
            //successful cc update
            //hide the cc details entry form, show vault_cc view, show the submit button
            self.$('#during_checkout_new_credit_card_details').css('display', 'none');
            self.$('#vault_cc').css('display', 'block');
            self.$('#vault_cc > #cc_masked_number').html(data.result.masked_number);
            self.$('#vault_cc > #cc_expiration_date').html(data.result.expiration_date);
            self.$('#submit_order').css('display', 'block');
            self.$('#vault_cc')
              .prepend(_.template(SuccessfulUserFeedbackHTML)({'success': 
              'Updated credit card'}))
      
          }
          

        },
        error: function (jqXHR, textStatus, errorThrown ) {
          console.log('ERROR: in submitting new cc details');
          console.dir(jqXHR);
          console.log(textStatus);
          console.dir(errorThrown);
 
          //TODO: implement futher
          self.render();
 
          return;

        }
      });



    },

   
    submit_order: function () {
      console.log('in submit_order function');
      var self = this;    

      if (!CookieUtil.get('reserve_tickets')) {
        //reservation TIMEDOUT

        //TODO implement further
        alert('YOUR TICKET RESERVATION HAS EXPIRED: Please start again.'); 
        return;
      } else {
        //reservation is still VALID
 
        //make http PUT /api/orders/:id request
        this.model.save({}, 
          {
            success: function (model,response) {
              console.log('SUCCESS in saving/updating the model => order has been made');
              console.dir(model);
              console.dir(response);
   
              //handle all the possible cc status responses
              self.handle_cc_statuses(response, model);
  
            },
            error: function (model, xhr) {
              console.log('ERROR in saving/updating the model');
              console.dir(model);
              console.dir(xhr);
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
        window.scrollTo(0, 350);

      } else if (status === 'authorized') {
        console.log('transaction_status: ' + status);

      } else {
        console.log('transaction_status: ' + status);
      }

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
  return CreditCardDetailsView;
  }
);
