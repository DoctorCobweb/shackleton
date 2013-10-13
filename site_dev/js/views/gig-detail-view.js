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

        //used in procedure to clear out old reserved tickets; may be around if user
        //has bailed on a gig purchase midway thru then tried to purchase some others
        this.is_reserve_tickets_cookie_present = this.parse_cookie_string();

        console.log('this.is_reserve_tickets_cookie_present: ' + 
                    this.is_reserve_tickets_cookie_present);
   
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

              //before showing number of tickets, see if there are already tickets 
              //reserved for another gig. if there is, delete cookie and give back
              //reserved tickets to general pool available.

              console.log('self.is_reserve_tickets_cookie_present: ' +
                          self.is_reserve_tickets_cookie_present);

              if (self.is_reserve_tickets_cookie_present) {
                //the reserve_cookie is hanging around from a previous attempt at buying
                //tickets
                self.reserve_tickets_release();

              } else {
                //no reserve_tickets cookie present
	        var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
	        self.showView('#featureContent', numberOfTicketsView); 
                window.scrollTo(0, 350);
              }

            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: tried to $.ajax GET /api/users/session');
            console.dir(jqXHR);
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);

            //there was an error. redirect back to the gig guide and get them
            //to start order process again
            alert('Internal Error: try again');
          } 
        });
      },


      parse_cookie_string: function () {
        //console.log('in parse_cookie_string()');
   
        this.cookies_obj = {};
        this.cookies_array = document.cookie.split(';');
        console.log('this.cookies_array:');
        console.dir(this.cookies_array);
   
        for (var key in this.cookies_array) {
          var name = this.cookies_array[key].substring(0,
                       this.cookies_array[key].indexOf('='));
          var value= this.cookies_array[key].substring(
                       this.cookies_array[key].indexOf('=') + 1 );
   
          //get rid of any whitespace at start or end
          name = name.replace(/^\s+|\s+$/g,"");
          this.cookies_obj[name] = value;
        }
        
        if (this.cookies_obj.reserve_tickets) {
          return true;
        } else {
          return false;
        }

      },

      
      reserve_tickets_release: function () {
        var self = this;
        console.log('this.is_reserve_tickets_cookie_present: ' +
                     this.is_reserve_tickets_cookie_present);


        console.log('checking for reserve_tickets cookie presence...');
          //give up the reserved tickets
          //and delete the cookie
          $.ajax({
            'url': '/api/orders/ticket_reserve_release_from_navigation',
            'type': 'GET',
             success: function (data, textStatus, jqXHR) {
               console.log('SUCCESS: released tickets due to navigating away');
               console.dir(data);
               console.log('textStatus: ' + textStatus);
               console.dir(jqXHR);


               //TODO: implement error handling from backend, if else stuff 

               self.is_reserve_tickets_cookie_present = false;
               console.log('successful release of reserved tix. go onto to next view');

	       var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
	       self.showView('#featureContent', numberOfTicketsView); 
               window.scrollTo(0,350);
             },
             error: function (jqXHR, textStatus, errorThrown) {
               console.log('ERROR: in releasing tickets dut to navigating away');
               console.dir(jqXHR);
               console.log('textStatus: ' + textStatus);
               console.dir(errorThrown);

               alert('internal error: try again later');
             },
          });          
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
