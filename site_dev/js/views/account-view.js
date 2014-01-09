// site/js/views/account-view.js


define([
    'backbone',
    'text!tpl/AccountView.html',
    'views/account-orders-view',
    'views/account-billing-view',
    'views/account-settings-view',
    'collections/ordersCollection',
    'views/account-billing-default-view',
    'models/user-model',
    'spin'
  ],
  function (Backbone, AccountViewHTML, 
            AccountOrdersView, AccountBillingView,
            AccountSettingsView, OrdersCollection,
            AccountBillingDefaultView, User,
            Spinner) 
  {
    var AccountView  = Backbone.View.extend({
      tagName: 'div',

      className: 'account_details',

      template: _.template(AccountViewHTML),

      events: {
        'click #account_orders' :       'orders',
        'click #account_billing':       'billing',
        'click #account_settings':      'settings',
        'mouseover #account_orders':    'select_proceed',
        'mouseout #account_orders':     'deselect_proceed',
        'mouseover #account_billing':   'select_proceed',
        'mouseout #account_billing':    'deselect_proceed',
        'mouseover #account_settings':  'select_proceed',
        'mouseout #account_settings':   'deselect_proceed'
      },


      select_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#1D883B');
      },
   

      deselect_proceed: function (e) {
        this.$('#' + e.currentTarget.id).css('background-color', '#2BBB53');
      },


      initialize: function () {
        console.log('in initialize() of account-view.js');
        
        this.BT_DEFAULT_CUS = 'default_braintree_customer_id';

        //show busy spinner until fetching gigs completes
        this.spinner_opts = {
          lines:17, // The number of lines to draw
          length: 13, // The length of each line
          width: 4, // The line thickness
          radius: 11, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: -1, // 1: clockwise, -1: counterclockwise
          //color: ['rgb(255, 255, 0)', //yellow
          //        'rgb(255, 165, 0)', //orange
          //        'rgb(255, 69,  0)'  //dark orange
          //       ], // #rgb or #rrggbb or array of colors
          color: '#ee680b',
          speed: 1, // Rounds per second
          trail: 24, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: '0px', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };
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

        //GET /api/orders/
        this.orders_collection.fetch({
          success: function (collection, response) {
            console.log('SUCCESS in fetching the orders collection');
            console.dir(collection);
            console.log(response);

            //error handling
            if (response.errors) {
              //we have errors when trying to fetch the collection

              if (!_.isEmpty(response.errors.validation_errors)) {
                console.log('VALIDATION_ERRORS: we have validation errors');
                self.render();
                return;
              } else if (!_.isEmpty(response.errors.internal_errors)) {
                console.log('INTERNAL_ERRORS: we have internal errors');
                self.render();
                return;
              }
            } else {
              var _view = new AccountOrdersView({model: collection});
              self.show_view('#account_main', _view);
            }
        
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

        var target = document.getElementById('account_main');
        var spinner = new Spinner(this.spinner_opts).spin(target);


        $.ajax({
          'url': '/api/users/account/billing_info/',
          'type': 'GET',
          success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: got billing info');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);
 
            spinner.stop();

            if (data.errors) {
              //either have validation/internal errors or user has no cc details yet.
              if (!_.isEmpty(data.errors.validation_errors)) {
                console.log('VALIDATION_ERRORS: we have validation errors');
                self.render();
                return; 
              } else if (!_.isEmpty(data.errors.internal_errors)) {
                console.log('INTERNAL_ERRORS: we have internal errors');

                if (data.errors.internal_errors.error === self.BT_DEFAULT_CUS) {
                  console.log('user has not yet submitted any cc details...');
                  var account_billing_default = new AccountBillingDefaultView();
                  self.show_view('#account_main', account_billing_default); 
                } else {
                  console.log('we have other internal errors');
                  self.render();
                  return; 
                }
              }
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

            spinner.close();
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
          //'url': '/api/users/settings/a_single_user',
          'url': '/api/users/settings/user',
          'type' : 'GET',
           success: function (data, textStatus, jqXHR) {
            console.log('SUCCESS: got user _id');
            console.dir(data);
            console.log(textStatus);
            console.dir(jqXHR);

            if (data.errors) {
              //we have errors
              console.log('ERROR: could not find user id');
              self.render();
              return;
            } else {

              if (!self.user){
                self.user = new User({_id: data});
              }

            }


            //GET /api/users/:id
            self.user.fetch({
              success: function (model_data, response, options) {
                console.log('SUCCESS: got user info');
                console.dir(model_data);
                console.log(response);
                console.dir(options);

                if (response.errors) {
                  //we have errors
                  if (!_.isEmpty(response.errors.validation_errors)) {
                    //there are validation errors, the id param is empty
                    console.log('VALIDATION_ERRORS: there were validation errors');
                    self.render();
                    return;
                  } else if (!_.isEmpty(response.errors.internal_errors)) {
                    //there are internal errors
                    console.log('INTERNAL_ERRORS: there were internal errors');
                    self.render();
                    return;
                  }
                } else {
                  //success
                  var account_settings_view = new AccountSettingsView({model: 
                                                                       model_data});
                  self.show_view('#account_main', account_settings_view);
                }


              },
              error: function (model, response, options) {
                console.log('ERROR: could not get user info');
                console.dir(model);
                console.log(response);
                console.dir(options);
                
                self.render();
              },
            });
           
           },
           error: function (jqXHR, textStatus, errorThrown) {
            console.log('ERROR: could not get user _id');
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
