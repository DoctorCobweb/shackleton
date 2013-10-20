// site/js/views/checkout-view.js


define([
    'backbone',
    'text!tpl/CheckoutView.html'
  ],
  function (Backbone, CheckoutHTML) {
    var CheckoutView = Backbone.View.extend({
      tagName: 'div',

      className: 'view_checkout_details',

      template: _.template(CheckoutHTML),

      events: {
        'click #import_passbook_pass': 'importPassbookPass'
      },

      initialize: function () {
        console.log('in initialize() of checkout-view.js');
        //console.log('is newOrder present? : ' + JSON.stringify(this.model, null, 4));

        //find the user-agent in order to customize the display based on which
        //device/browser the user is ...using...
        console.log('window.navigator.userAgent: ' + window.navigator.userAgent);

        this.theUserAgent = this.findTheUserAgent();
        console.log('theUserAgent is: ' + this.theUserAgent);
          
        //add listener to this.model so the ui updates when server has 
        //finished with transaction and hence filling out the model's fields
        //n.b. when you use listenTo, the 'this' context in the callback refers
        //to the 'this' of the listening object.
        //in the case below, our callback is the view's render function and the
        //context of the listening object is the view itself. tricky but vital to know
        this.listenTo(this.model, 'change', this.updateHandler);


        this.current_view = this;
 
      },

      render: function () {
        console.log('in checkout-view.js and render()');
 

        this.$el.html(this.template(this.model.toJSON()));


        //display pkpass link if user is on iphone/safari/mobile
        if (this.theUserAgent === 'iPhone/Safari/Mobile') {
          console.log('the user-agent is iPhone/Safari/Mobile. display pkpass link');
          console.log(this.$el);
          console.log(this.$('#import_passbook_pass'));
          this.$('#import_passbook_pass').css('display', 'block');
        }


        return this;
      },

      updateHandler: function () {
        console.log('in updateHandler() since this.model emitted a \'change\' event');

        
        if (this.model.get('transaction_status') === "submitted_for_settlement" 
            && this.model.get('user_authenticated') === true) {

          console.log('submitted_for_settlement and user __IS__ authorized.');
          this.render();

          // 

          //create successful purchase view
          //var theSuccessfulPurchaseView = new SuccessfulPurchaseView({
          //  model:this.model};


          //trigger a process to create an electronic ticket

          return;
        }


        //otherwise, handle the different status types returned from transaction
        switch (this.model.get('transaction_status')) {
          case "authorized":
            console.log('switch block and transaction_status: authorized');
            this.render();
            break;
          case "authorization_expired":
            console.log('switch block and transaction_status: authorization_expired');
            this.render();
            break;
          case "processor_declined":
            console.log('switch block and transaction_status: processor_declined');
            this.render();
            break;
          case "gateway_rejected":
            console.log('switch block and transaction_status: gateway_rejected');
            this.render();
            break;
          case "failed":
            console.log('switch block and transaction_status: failed');
            this.render();
            break;
          case "void":
            console.log('switch block and transaction_status: void');
            this.render();
            break;
          case "submitted_for_settlement":
            console.log('switch block and transaction_status: submitted_for_settlement');
            this.render();
            break;
          case "settling":
            console.log('switch block and transaction_status: settling');
            this.render();
            break;
          case "settled":
            console.log('switch block and transaction_status: settled');
            this.render();
            break;
          default:
            console.log('switch block and in default handler'); 
            this.render();
            break;
        }

        return;
      },

      findTheUserAgent: function () {

       //supported types:
       //browser: chrome, firefox, safari
       //device: macintosh, iphone, ipad

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

      importPassbookPass: function () {
        console.log('in importPassbookPass handler');

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
