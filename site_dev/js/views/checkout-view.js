// site/js/views/checkout-view.js


define([
    'backbone',
    'text!tpl/CheckoutView.html',
    'text!tpl/SuccessfulUserFeedback.html'
  ],
  function (Backbone, CheckoutHTML, SuccessfulUserFeedbackHTML) {
    var CheckoutView = Backbone.View.extend({
      tagName: 'div',


      className: 'view_checkout_details',


      template: _.template(CheckoutHTML),


      events: {
        //'click #import_pkpass': 'import_pkpass',
        'click #import_pkpass_link': 'import_pkpass_link'
      },



      initialize: function () {
        console.log('in initialize() of checkout-view.js');
        //console.log('is newOrder present? : ' + JSON.stringify(this.model, null, 4));

        //find the user-agent in order to customize the display based on which
        //device/browser the user is ...using...
        console.log('window.navigator.userAgent: ' + window.navigator.userAgent);

        this.the_user_agent = this.find_the_user_agent();
        console.log('the_user_agent is: ' + this.the_user_agent);
          
        this.current_view = this;
      },



      render: function () {
        console.log('in checkout-view.js and render()');

        this.$el.html(this.template(this.model.toJSON()));

        //this.$('#import_passbook_pass').css('display', 'block');
    
        //for dev purposes
        this.$('#import_pkpass_link').css('display', 'block');

        //uncomment after finished playng around with pkpass stuff.
        //display pkpass link if user is on iphone/safari/mobile
        //alert(this.the_user_agent);
        /*
        if (this.the_user_agent === 'iPhone/Safari/Mobile') {
          console.log('the user-agent is iPhone/Safari/Mobile. display pkpass link');
          console.log(this.$el);
          //console.log(this.$('#import_passbook_pass'));
          this.$('#import_pkpass_link').css('display', 'block');
        }
        */

        return this;
      },



      //supported user agent types:
      //browser: chrome, firefox, safari
      //device: macintosh, iphone, ipad
      find_the_user_agent: function () {

        //TODO:
        //check also for Mobile keyword in user-agent???
 
        var ua_elaborate = window.navigator.userAgent;
        var ua_extracted = '';
 
        if (ua_elaborate.search(/macintosh/i) !== -1 
                 && ua_elaborate.search(/chrome/i) !== -1 ) 
        {
          ua_extracted = 'Macintosh/Chrome';
        }
        else if (ua_elaborate.search(/macintosh/i) !== -1 
                 && ua_elaborate.search(/firefox/i) !== -1 ) 
        {
          ua_extracted = 'Macintosh/Firefox';
        }
        else if (ua_elaborate.search(/macintosh/i) !== -1 
                 && ua_elaborate.search(/safari/i) !== -1 ) 
        {
          ua_extracted = 'Macintosh/Safari';
        }
        else if (ua_elaborate.search(/iphone/i) !== -1 
                 && ua_elaborate.search(/chrome/i) !== -1 
                 && ua_elaborate.search(/mobile/i) !== -1 ) 
        {
          ua_extracted = 'iPhone/Chrome/Mobile';
        }
        else if (ua_elaborate.search(/iphone/i) !== -1 
                 && ua_elaborate.search(/firefox/i) !== -1
                 && ua_elaborate.search(/mobile/i) !== -1 ) 
        {
          ua_extracted = 'iPhone/Firefox/Mobile';
        }
        else if (ua_elaborate.search(/iphone/i) !== -1 
                 && ua_elaborate.search(/safari/i) !== -1
                 && ua_elaborate.search(/mobile/i) !== -1 ) 
        {
          ua_extracted = 'iPhone/Safari/Mobile';
        }
        else if (ua_elaborate.search(/ipad/i) !== -1 
                 && ua_elaborate.search(/chrome/i) !== -1
                 && ua_elaborate.search(/mobile/i) !== -1)
        {
          ua_extracted = 'iPad/Chrome/Mobile';
        }
        else if (ua_elaborate.search(/ipad/i) !== -1 
                 && ua_elaborate.search(/firefox/i) !== -1
                 && ua_elaborate.search(/mobile/i) !== -1)
        {
          ua_extracted = 'iPad/Firefox/Mobile';
        }
        else if (ua_elaborate.search(/ipad/i) !== -1 
                 && ua_elaborate.search(/safari/i) !== -1
                 && ua_elaborate.search(/mobile/i) !== -1)
        {
          ua_extracted = 'iPad/Safari/Mobile';
        }
        else {
          ua_extracted = 'unable_to_determine_user_agent_extracted';
        } 
  
        return ua_extracted;
      },


      import_pkpass_link: function () {
        //hide the <a> after clicking it to avoid multiple submittions
        this.$('#import_pkpass_link').css('display', 'none');
        this.$('#checkout_details').prepend(_.template(SuccessfulUserFeedbackHTML)({
          'success': 'Importing your pass now...'}));
 

      },



      //NOT USED CURRENTLY
      //called when user clicks the import_pkpass <div>
      import_pkpass: function () {
        console.log('in import_pkpass handler');

        var self = this;
        var gig = self.model.get('gig_id');
        var order = self.model.get('_id');

        var the_url  = 'api/mobile_tickets/pkpass?' 
                    + 'gig_id=' + this.model.get('gig_id')
                    + '&order_id=' + this.model.get('_id')
                    + '&order_first_name=' + this.model.get('first_name')                                     + '&order_last_name=' + this.model.get('last_name')
                    + '&order_main_event=' + this.model.get('main_event')
                    + '&order_number_of_tickets=' + this.model.get('number_of_tickets')                       + '&order_transaction_status=' + this.model.get('transaction_status');

        //TODO
        //this version of getting the pkass via ajax and triggering a download (like the
        //(<a> link version of getting the pkpass) is NOT WORKING yet. 
        $.ajax({
          url: the_url,
          type: 'GET',
          crossDomain: true,
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: pkpass mobile ticket response from THE_JAMES_CAIRD');

            //data will be the raw buffer contents of the downloaded pkpass from aws
            //because weve said return res.redirect(response.body) in mobile_tickets.js
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);



            //data.body is the pre-signed aws url of the pkpass available for download!
            //emit event saying the pkpass is avail for download so router hears it and
            //triggers the route handler
            //Backbone.trigger('order:pkpass_available', data.body);

            //window.location.href = data.body;


          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: not get pkpass mobile tix response THE_JAMES_CAIRD');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);
   
            self.render();
          }
        });
      },



      show_view: function (selector, view) {

        console.log('in showView()');
        console.log('in showView(), this.currentView: ');
        console.log(this.current_view);
        if (this.current_view) {
          this.current_view.close();
        }
        $(selector).html(view.render().el);
        this.current_view = view;
        return view;
      }


    }); //end Backbone.View.extend
    return CheckoutView;
  }
);
