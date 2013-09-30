// site/js/views/account-view.js


define([
    'backbone',
    'text!tpl/AccountView.html',
    'views/account-orders-view',
    'views/account-billing-view',
    'views/account-settings-view',
    'collections/ordersCollection',
    'views/account-billing-default-view'
  ],
  function (Backbone, AccountViewHTML, 
            AccountOrdersView, AccountBillingView,
            AccountSettingsView, OrdersCollection,
            AccountBillingDefaultView) 
  {
    var AccountView  = Backbone.View.extend({
      tagName: 'div',

      className: 'account_details',

      template: _.template(AccountViewHTML),

      events: {
        'click #account_orders' :  'orders',
        'click #account_billing':  'billing',
        'click #account_settings': 'settings'

      },


      initialize: function () {
        console.log('in initialize() of account-view.js');

      },


      render: function () {
        console.log('in account-view.js and render()');

        //at the moment we have no model assigned to go to AboutViewHTML template
        this.$el.html(this.template());

        return this;
      },


      orders: function () {
        console.log('in orders handler');
        var self = this;

        if (!this.orders_collection) {
          this.orders_collection = new OrdersCollection();
        }

        this.orders_collection.fetch({
          success: function (collection, response) {
            console.log('SUCCESS in fetching the orders collection');
            console.dir(collection);
            console.log(response);
        
            var _view = new AccountOrdersView({model: collection});
            self.show_view('#account_main', _view);
          },
          error: function (collection, response) {
            console.log('ERROR in fetching the orders collection');
            console.dir(collection);
            console.log(response);
          }  
        });
      },



      billing: function () {
        console.log('in billing handler');

        var self = this;

        $.ajax({
          'url': '/api/users/account/billing_info/',
          'type': 'GET',
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: got billing info');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.error) {
              //user does not have a stored cc in vault => have not made a purchase yet
              //flesh out more later...
              //alert('no braintree_customer_id present. error: ' + data.error);

              var account_billing_default = new AccountBillingDefaultView();
              self.show_view('#account_main', account_billing_default); 

              
            } else {
              var account_billing_view = new AccountBillingView({billing_data: data});
              self.show_view('#account_main', account_billing_view);
  
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: could not got billing info');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);
          }
        });
      },


      //TODO: make settings use a User backbone model and then call model#update to
      //to the updating. should simplify the front end code.
      //need to make a new route potentially to handle the user updating stuff.
      //atm this is a complete hack using a practically duplicated api serving a user
      //document.
      settings: function () {
        console.log('in settingshandler');
        var self = this;

        $.ajax({
          'url': '/api/users/settings/a_single_user',
          'type' : 'GET',
           success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: got user info');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            var account_settings_view = new AccountSettingsView({model: data});
            self.show_view('#account_main', account_settings_view);
           
           },
           error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: could not get user info');
            console.dir(jqXHR);
            console.log(textStatus);
            console.dir(errorThrown);

           },

        });


      },



      show_view: function (element, view) {
        console.log('in show_view, and this.current_view is: ');
        console.log(this.current_view);

        if (this.current_view) {
          this.current_view.close();
        }
        $(element).html(view.render().el);
        this.current_view = view;
        return view;
      }


    });
    return AccountView;
  }
);
