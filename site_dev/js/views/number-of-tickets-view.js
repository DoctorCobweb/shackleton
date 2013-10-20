// site/js/views/number-of-tickets-view.js


define([
    'backbone',
    'text!tpl/NumberOfTicketsView.html',
    'models/order-model',
    'collections/ordersCollection',
    'views/credit-card-details-view',
    'views/checkout-view',
    'views/purchase-with-credit-card-from-vault-view',
    'text!tpl/NegativeUserFeedback.html'
  ],
  function (Backbone, 
            NumberOfTicketsHTML, 
            OrderModel, 
            OrdersCollection,
            CreditCardDetailsView,
            CheckoutView,
            PurchaseWithCreditCardFromVaultView,
            NegativeUserFeedbackHTML) 
  {

    var NumberOfTicketsView = Backbone.View.extend({
      tagName: 'div',

      //className: 'number_of_tickets_details',
      className: 'view_number_of_tickets',

      template: _.template(NumberOfTicketsHTML),

      events: {
        'click #ticket_amount_one':    'one_ticket',
        'click #ticket_amount_two':    'two_tickets',
        'click #ticket_amount_three':  'three_tickets',
        'click #ticket_amount_four':   'four_tickets',
        'click #ticket_amount_five':   'five_tickets',
        'click #ticket_amount_six':    'six_tickets',
        'click #ticket_amount_seven':  'seven_tickets',
        'click #ticket_amount_eight':  'eight_tickets',
        'click #submit':               'submit',
        'mouseover .ticket_select':    'select_ticket',
        'mouseout .ticket_select':     'deselect_ticket',
        'mouseover .proceed':          'select_proceed',
        'mouseout .proceed':           'deselect_proceed'
      },


      select_ticket: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#AAB61D');
      },

      deselect_ticket: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#efff33');
      },

      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },

      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
      },
      

      initialize: function () {
        console.log('in initialize() of number-of-tickets-view.js');

        this.BT_DEFAULT_CUS = 'default_braintree_customer_id';

        //make sure this always refers the the view
        _.bindAll(this);

        //BUG: when navigating back to another gig after selecting some ticke
        //a gig, this throws a Converting circular structure to JSON TypeError
        //console.log('this.model: ' + JSON.stringify(this.model));
  
        this.number_of_tickets = 0;
        this.total_amount = 0;
        this.tmp_model = {};
       
        console.log('this.options');
        for (var key in this.options) console.log(this.options[key]);

        //CAUSES A BUG. see router.js Backbone.on('router:set_current_view')
        //tell router to set its this.currentView variable to this view
        //Backbone.trigger('router:set_current_view', this);

      },

      render: function () {
        console.log('in number-of-tickets-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));
        this.current_view = this;

        //this.$().on('hover',);

        return this;
      },


      one_ticket: function () {
        this.number_of_tickets = 1;
        this.calculate_total_and_display();

      },

      two_tickets: function () {
        this.number_of_tickets = 2;
        this.calculate_total_and_display();

      },

      three_tickets: function () {
        this.number_of_tickets = 3;
        this.calculate_total_and_display();

      },
 
      four_tickets: function () {
        this.number_of_tickets = 4;
        this.calculate_total_and_display();

      },

      five_tickets: function () {
        this.number_of_tickets = 5;
        this.calculate_total_and_display();

      },

      six_tickets: function () {
        this.number_of_tickets = 6;
        this.calculate_total_and_display();
      },
 
      seven_tickets: function () {
        this.number_of_tickets = 7;
        this.calculate_total_and_display();
      },

      eight_tickets: function () {
        this.number_of_tickets = 8;
        this.calculate_total_and_display();
      },

      calculate_total_and_display: function () {
        this.total_amount = this.number_of_tickets * this.model.get('price');

        //set number_of_tickets field in this.model, which is also this.order in router
        this.model.set({'number_of_tickets': self.number_of_tickets});

        console.log('Total price for ' + this.number_of_tickets + ' is: ' 
          + this.total_amount);

        //display the total amount for the tickets reserved
        this.$('#total_amount').html(this.total_amount);

        return;
      },


      submit: function () {
        console.log('clicked proceed to payment button');
        var self = this;

        if(!self.number_of_tickets) {
          console.log('ERROR: no tickets have been selected');
          this.$('#number_of_tickets')
            .prepend(_.template(NegativeUserFeedbackHTML)({'error': 'No tickets selected'}));

          return;
        }


        //*** CREATE A NEW ORDER HERE ***
        if (!this.new_order) {
          this.new_order = new OrderModel();
        }

        this.new_order.set({
          gig_id: self.model.get('_id'),
          ticket_price: self.model.get('price'),
          number_of_tickets : self.number_of_tickets,
          transaction_amount: self.total_amount
        });
        

        if (!this.orders_collection) {
          this.orders_collection = new OrdersCollection();
        }

        this.orders_collection.add(this.new_order);
       
        this.new_order.save({}, {
          success: function (model, response) {
            console.log('SUCCESS: saved the new_order for the first time.');
            console.dir(model);
            console.dir(response);

            //when using backbone model sync, it expects that ONLY the model is 
            //returned to the client. if you dont, and say, return an obj with other field
            //in it as well as the model, backbone wont be able to find the id parameter
            //to sync with. here it is the _id param of a mongodb document.  
            //
            //so, if there are errors, there will be response.success === false and other
            //fields. if there were NO errors, backend just returns the model. nothing
            //else. => for a successful operation, response.success === undefined !!!!
            //because response === model // in this case, the new_order model. 
            if (response.success === false) {
              //we have errors

     
              if (!_.isEmpty(response.errors.validation_errors)) {
                //there are validation errors
                console.log('VALIDATION_ERRORS:');
                alert('VALIDATION_ERRORS');
                console.dir(response.errors.validation_errors);

                //loop through the Array of validation errors and log them to console
                for (var key in response.errors.validation_errors) {
                  console.log('validation_errors[' + key + ']: ' +
                              response.errors.validation_errors[key]);

                  //var id_of_bad_input = '#' + data.errors.validation_errors[key].param;
                  //console.log(id_of_bad_input);
                  //$(id_of_bad_input).parent('.form-group').addClass('has-error');
                }

                return;

              } else if (!_.isEmpty(response.errors.internal_errors)) {
                //there are internal errors
                console.log('INTERNAL_ERRORS:');
                alert('INTERNAL_ERRORS: try again');

                //loop through the Array of validation errors and log them to console
                for (var key in response.errors.internal_errors) {
                  console.log('internal_errors[' + key + ']: ' +
                              response.errors.internal_errors[key]);
                }
 
                return;
              } 
            } else {
              //successful order creation
              //check to see if the user is a first time purchaser or returning one.
              //show them different views depending on this answer.

              console.log('CUSTOM_EVENT(order:start, trigger)');
              console.log('CUSTOM_EVENT(order:start, trigger), parameter: ' + 
                           response._id);
              Backbone.trigger('order:start', response._id);
              //Backbone.trigger('order:start', 'a', 'b', 'c', 'd');

              if (response.braintree_customer_id === self.BT_DEFAULT_CUS) {

                //first time purchaser
                console.log('SUCCESSful order creation, FIRST TIME PURCHASER.');
                console.log('self.new_order:');
                console.dir(self.new_order);
                console.log('model:');
                console.dir(model);

                var cc_details_view = new CreditCardDetailsView({model: self.new_order});
                self.show_view('#featureContent', cc_details_view);
                window.scrollTo(0, 350);
              
              } else if (response.braintree_customer_id !== self.BT_DEFAULT_CUS) {

                //returning purchaser
                console.log('SUCCESSful order creation, RETURNING PURCHASER.');
                console.log('self.new_order:');
                console.dir(self.new_order);
                console.log('model:');
                console.dir(model);
  
                var purchase_with_vault_cc = new PurchaseWithCreditCardFromVaultView({
                  model: self.new_order});

                self.show_view('#featureContent', purchase_with_vault_cc);
                window.scrollTo(0, 350);
              } 
            }
          },
          error: function (model, xhr) {
            console.log('ERROR: could not save the new_order for the first time.');
            console.dir(model);
            console.dir(xhr);

            alert('ERROR: ajax callback: could not save the new_order model.');
            //self.render();
          }
        }); 

      },



      show_view: function (selector, view) {
        console.log('in showView of number-of-tickets-view.js');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      }

    }); //end Backbone.View.extend
    return NumberOfTicketsView;
  }
);
