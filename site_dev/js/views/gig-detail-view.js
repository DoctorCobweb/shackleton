// site/js/views/gig-detail-view.js

//the view for an actual gig to be displayed.

define([
    'backbone',
    'text!tpl/GigDetails.html',
    './number-of-tickets-view',
    'models/order-model',
    'collections/ordersCollection',
    'views/login-with-gig-details-view',
    'cookie_util'
  ], 
  function (Backbone, GigDetailsHTML, 
            NumberOfTicketsView, OrderModel, 
            OrdersCollection, LoginWithGigDetails,
            CookieUtil) {

    var Gig = Backbone.View.extend({
      tagName: 'div',

      className: 'gigDetails',

      template: _.template(GigDetailsHTML),

      events: {
        'click #get_tickets':        'get_tickets',
        'mouseover #get_tickets' :   'select_proceed',
        'mouseout #get_tickets' :    'deselect_proceed'
      },



      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },
  
      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
      },



      initialize: function () {
        console.log('in initialize() of gig-detail-view.js');

        this.current_view = this;

        //cache the elements referenced using jQuery
        //ERROR: querying for #number_of_tickets results in an empty object!!!
        //WHY is this so? answer = model is not rendered.
        //put this call into render()....
        //this.$number_of_tickets = this.$('#number_of_tickets');
        //console.dir(this.$('#number_of_tickets'));

        this.old_reserve_tickets_cookie = CookieUtil.get('reserve_tickets');



        if (this.old_reserve_tickets_cookie) {
        
          //TODO: make this more robust and clearer. shit at the mo.
          //parse the old cookie for the order_id
          //this.old_reserve_tickets_cookie_order_id = 
          var left_brace = this.old_reserve_tickets_cookie.indexOf('{');
          var right_brace = this.old_reserve_tickets_cookie.indexOf('}');

          console.log('left_brace = ' + left_brace + ' right_brace = ' + right_brace);

          var the_order = 'order_id\":\"';
          console.log('the_order.length = ' + the_order.length);

          var the_order_start = this.old_reserve_tickets_cookie.indexOf(the_order);
          console.log(this.old_reserve_tickets_cookie.substring(the_order_start, right_brace + 1)); 

          var order_value_start = the_order_start + the_order.length;
          console.log('order_value_start: ' + order_value_start);

          this.the_old_order_id = this.old_reserve_tickets_cookie.substring( order_value_start, right_brace - 1);

          console.log('this.the_old_order_id: ' + this.the_old_order_id);

          

        }


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

        return this;
      },



      get_tickets: function () {
        console.log('in get_tickets click handler.');
        var self = this;

        //tell router to stop polling for cookie existence because we're going to del
        //the old cookie here and dont want the router trying to do release 
        //tickets in backend also.
        if (self.old_reserve_tickets_cookie) {
          Backbone.trigger('order:stop_polling');
        } 


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
              self.show_view('#featureContent', loginWithGigDetails); 

            } else if (data.user_authenticated === true) {
              //user has a session => are logged in
              //display the number of tickets view with gig_id sent in

              //only proceed if delete reserved tickets is successful. if not & you 
              //navigate onwards to buy tickets, the reserve_tickets will get overwritten
              //without releasing the old tickets reserved! BAD
              if (self.old_reserve_tickets_cookie) {
                console.log('there is an OLD reserve_tickets cookie, value: ');
                //console.log(self.old_reserve_tickets_cookie);
                console.log('...deleting by phoning home...');

                self.reserve_tickets_release();

              } else {
                //no reserve_tickets cookie present
	        var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
	        self.show_view('#featureContent', numberOfTicketsView); 
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


      
      reserve_tickets_release: function () {
        var self = this;

        console.log('checking for reserve_tickets cookie presence...');
          //give up the reserved tickets
          //and delete the cookie

          //gotta find the order_id from cookie value, 
          //or use cookie server side to get it (since it is not deleted yet..)
          var post_data = {
            'the_cookie': 'reserve_tickets',
            'reserved_order_id': self.the_old_order_id
          };
       

          $.ajax({
            url: '/api/orders/give_up_reserved_tickets',
            type: 'POST',
            data: post_data,
            success: function (data, textStatus, jqXHR) {
              console.log('SUCCESS: released tickets due to navigating away');
              console.dir(data);
              console.log('textStatus: ' + textStatus);
              console.dir(jqXHR);


              //TODO: implement error handling from backend, if else stuff 
              console.log('successful release of reserved tix. go onto to next view');


             var numberOfTicketsView = new NumberOfTicketsView({model: self.model});
              self.show_view('#featureContent', numberOfTicketsView); 
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


      show_view: function (selector, view) {
        console.log('in showView in gig-detail-view.js');
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view; 
      } 

    });
    return Gig;
  }
);
