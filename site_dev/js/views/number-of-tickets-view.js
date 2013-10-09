// site/js/views/number-of-tickets-view.js


define([
    'backbone',
    'text!tpl/NumberOfTicketsView.html',
    'models/order-model',
    'collections/ordersCollection',
    'views/credit-card-details-view',
    'views/checkout-view',
    'views/purchase-with-credit-card-from-vault-view'
  ],
  function (Backbone, 
            NumberOfTicketsHTML, 
            OrderModel, 
            OrdersCollection,
            CreditCardDetailsView,
            CheckoutView,
            PurchaseWithCreditCardFromVaultView) 
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
        'click #submit':               'submit'
      },

      initialize: function () {
        console.log('in initialize() of number-of-tickets-view.js');
        console.log('this.model: ' + JSON.stringify(this.model));
  
        this.number_of_tickets = 0;
        this.total_amount = 0;
        this.tmp_model = {};
       
        console.log('this.options');
        for (var key in this.options) console.log(this.options[key]);
      },

      render: function () {
        console.log('in number-of-tickets-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));
        this.current_view = this;
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

            
            if (response.error) {
              console.log('response.first_time_purchaser returned NOT as expected');
              alert('ERROR: ' + response.error);
              console.log(self.new_order);
              self.render();
 
            } else if (response.braintree_customer_id === 
                       'default_braintree_customer_id') {

              console.dir(self.new_order);
              var cc_details_view = new CreditCardDetailsView({model: self.new_order});
              self.show_view('#featureContent', cc_details_view);
              window.scrollTo(0, 350);
              
            } else if (response.braintree_customer_id !== 
                       'default_braintree_customer_id') {

              /*
              //save the order again to hit the PUT /api/orders/:id handler
              //bad for performance as we are making 2 https requests. should short cut
              //this in the backend by calling PUT handler from POST handler somehow
              self.new_order.save({}, {
                success: function (model, response) {
                console.log('SUCCESS: resaved this.new_order');
                  var checkout_view = new CheckoutView({model: self.new_order});
                  self.show_view('#featureContent', checkout_view);
                },
                error: function (model, xhr) {
                  console.log('ERROR: tried to resave this.new_order');
                
                }

              });
              */

              var purchase_with_vault_cc = new PurchaseWithCreditCardFromVaultView({
                model: self.new_order
              });
              self.show_view('#featureContent', purchase_with_vault_cc);
              window.scrollTo(0, 350);


            } else {
              console.log('hit the bottom of if logic, uh oh');
              self.render();
            }


          },
          error: function (model, xhr) {
            console.log('ERROR: could not save the new_order for the first time.');
            console.dir(model);
            console.dir(xhr);

            alert('ERROR: could not save the new_order model.');
            self.render();
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
