// site/js/views/gig-detail-view.js

//the view for an actual gig to be displayed.

define([
    'backbone',
    'text!tpl/GigDetails.html',
    './number-of-tickets-view',
    'models/order-model',
    'collections/ordersCollection',
    'views/login-with-gig-details-view'
  ], 
  function (Backbone, GigDetailsHTML, 
            NumberOfTicketsView, OrderModel, 
            OrdersCollection, LoginWithGigDetails) {

    var Gig = Backbone.View.extend({
      tagName: 'div',

      className: 'gigDetails',

      template: _.template(GigDetailsHTML),

      events: {'click #get_tickets': 'getTickets'},

      initialize: function () {
        console.log('in initialize() of gig-detail-view.js');
   
        //cache the elements referenced using jQuery
        //ERROR: querying for #number_of_tickets results in an empty object!!!
        //WHY is this so? answer = model is not rendered.
        //put this call into render()....
        //this.$number_of_tickets = this.$('#number_of_tickets');
        //console.dir(this.$('#number_of_tickets'));
        

        console.log('this.options: ');
        for (var key in this.options) {
          console.log(this.options[key]);
        }
      },

      render: function () {
        console.log('in gig-detail-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));
        
        //put jQuery caching here, as opposed to in intialize as DOM has not been
        //populated yet with template variable gotten from the underlying model.
        //this.$number_of_tickets = this.$('#number_of_tickets');
       
        //console.dir(this.$('#number_of_tickets'));
        console.log('this.model: ');
        console.dir(this.model);

        this.currentView = this;
        return this;
      },

      getTickets: function () {
        console.log('in getTickets click handler.');
        var self = this;

        // GET api/users/session
        $.ajax({
          url: '/api/users/session',
          type: 'GET',
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: got $.ajax GET /api/users/session');
            console.dir(data);
            console.log('textStatus: ' + textStatus);
            console.dir(jqXHR);

            if (!data.user_authenticated) {
              //there is no session set up for the user => not logged in.
              //display login form with gig_id sent in
              var loginWithGigDetails = new LoginWithGigDetails({model: self.model});
              self.showView('#featureContent', loginWithGigDetails); 

            } else if (data.user_authenticated === true) {
              //user has a session => are logged in
              //display the number of tickets view with gig_id sent in


	      var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
	      self.showView('#featureContent', numberOfTicketsView); 
            }


          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: tried to $.ajax GET /api/users/session');
            console.dir(jqXHR);
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);

            //there was an error. redirect back to the gig guide and get them
            //to start order process again
            

          } 

        });




        /*
        tmp_gig_id = this.model.get('_id');
        tmp_ticket_price = this.model.get('price');
        //console.log('this : ' + this); //this refers to this View 

        if (!this.newOrder) {
          this.newOrder = new OrderModel();
        }
        this.newOrder.set({gig_id: tmp_gig_id, ticket_price: tmp_ticket_price});


        if (!this.newOrdersCollection) {
          this.newOrdersCollection = new OrdersCollection();
        }
        this.newOrdersCollection.add(this.newOrder);


        numberOfTicketsView = new NumberOfTicketsView({model: this.newOrder});
        this.showView('#featureContent', numberOfTicketsView); 
        */
      },

      showView: function (selector, view) {
        console.log('in showView in gig-detail-view.js');
        if (this.currentView) {
          this.currentView.close();
        }
        $(selector).html(view.render().el);
        this.currentView = view;
        return view; 
      } 

    });
    return Gig;
  }
);
