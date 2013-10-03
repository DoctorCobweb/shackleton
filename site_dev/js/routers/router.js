/*
 *
 * MAIN APPLICATION ROUTER
 *
 */


// site/js/routers/router.js

//the main application router

//dealing with a tab with 2 views: keep track of both views using this.currentView
//and this.defaultLandingView
//then call .close() manually on them in the router handlers.

define([
    'backbone',
    'views/gigs-view',
    'views/about-view',
    'views/contact-view',
    'views/login-view',
    'views/home-landing-view',
    'views/gig-detail-view',
    'collections/gigGuide',
    'views/gig-guide-landing-view',
    'models/user-model',
    'views/user-details-view',
    'views/logged-out-view',
    'models/order-model',
    'views/number-of-tickets-view',
    'collections/ordersCollection',
    'views/checkout-view',
    'views/account-view',
    'views/register-view',
    'views/privacy-policy-view',
    'views/returns-policy-view',
    'views/ticket-types-view',
    'views/newsletter-view',
    'views/faq-view',
    'views/search-view'

  ], 
  function (Backbone, GigsView, AboutView, ContactView, LoginView,
    HomeLandingView, GigDetailView, GigCollection, GigGuideLandingView,
    UserModel, UserDetailsView, LoggedOutView,  
    OrderModel, NumberOfTicketsView,
    OrdersCollection, CheckoutView, 
    AccountView, RegisterView,
    PrivacyPolicyView, ReturnsPolicyView,
    TicketTypesView, NewsletterView,
    FaqView, SearchView) {

    var AppRouter = Backbone.Router.extend({
    
      initialize: function () {
        console.log('in initialize() of router.js');
       
        /*
        //TODO - get callback handler functioning properly from gig list item
        Backbone.on('gig-item-clicked', function () {
          console.log('***EVENT: gig-item-clicked event occurred.***');
        });
        */


        //add in dropdown toggle functionality for the overflow button which appears 
        //only on small devices.

        //$.('#gigs_li')



      },
 

      routes: {
        '':                          'index',
        'about':                     'about',
        'login':                     'login',
        'contact':                   'contact',
        'gigs':                      'gig_guide',
        'gigs/:id':                  'gig_details',
        'users/session/:id':         'session',
        'logout':                    'logout',
        'users/session/goodbye':     'goodbye',
        'delete-user-account/:id':   'delete_user_account',
        'account':                   'account',
        'privacy_policy':            'privacy_policy',
        'returns_policy':            'returns_policy',
        'ticket_types':              'ticket_types',
        'newsletter':                'newsletter',
        'faq':                       'faq',
        'search' :                   'search',
        'register':                  'register'


      },

     register: function () {
       console.log('in register() of router.js');

       this.check_authentication_set_links();

       if (!this.theRegisterView) {
        this.theRegisterView = new RegisterView();
       }
       this.show_view('#featureContent', this.theRegisterView);
     },



     privacy_policy: function () {
       console.log('in privacy_policy handler');

       if (!this.thePrivacyPolicyView) {
        this.thePrivacyPolicyView = new PrivacyPolicyView();
       }
       this.show_view('#featureContent', this.thePrivacyPolicyView);
     },     
     
     returns_policy: function () {
       console.log('in returns_policy handler');
       if (!this.theReturnsPolicyView) {
        this.theReturnsPolicyView = new ReturnsPolicyView();
       }
       this.show_view('#featureContent', this.theReturnsPolicyView);
     },     

     ticket_types: function () {
       console.log('in ticket_types handler');

       if (!this.theTicketTypesView) {
        this.theTicketTypesView = new TicketTypesView();
       }
       this.show_view('#featureContent', this.theTicketTypesView);
     },     

     newsletter: function () {
       console.log('in newsletter handler');

       if (!this.theNewsletterView) {
        this.theNewsletterView = new NewsletterView();
       }
       this.show_view('#featureContent', this.theNewsletterView);
     },     

     faq: function () {
       console.log('in faq handler');
       if (!this.theFaqView) {
        this.theFaqView = new FaqView();
       }
       this.show_view('#featureContent', this.theFaqView);
     },     

     search: function () {
       console.log('in search handler');
       if (!this.theSearchView) {
        this.theSearchView = new SearchView();
       }
       this.show_view('#featureContent', this.theSearchView);
     },     


      check_authentication_set_links: function () {
        console.log('in check_authentication_set_links handler');

        var self = this;

        $.ajax({
          url: '/api/users/session',
          type: 'GET',
          success: function( data, textStatus, jqXHR ) {
            if (data.user_authenticated === true) {
              console.dir(data);
              console.log('Get response: yuppupupup');
              console.log(textStatus);
              console.dir(jqXHR);

              //toggle login -> to -> logout in header view 
              self.switch_log_button('#logout_header', '#login_header');
              self.display_account_tab(true);
            }
          }
        });

      },


      account: function () {
        console.log('in account handler');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        this.check_authentication_set_links();
        var account_view = new AccountView();
        this.show_view('#featureContent', account_view);


      },


     

      index: function () {
        console.log('in index() of router.js');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        this.check_authentication_set_links();

        if (!this.theHomeLandingView) {
         this.theHomeLandingView = new HomeLandingView();
        }
        this.show_view('#featureContent', this.theHomeLandingView);
      },




      about: function () {
        console.log('in about() of router.js');

        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();


        this.check_authentication_set_links();


        if (!this.theAboutView) {
          this.theAboutView = new AboutView();
        }
        this.show_view('#featureContent', this.theAboutView);
      },



      login: function () {
        console.log('in login() of router.js');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        this.check_authentication_set_links();

        var theLoginView = new LoginView();
        this.show_view('#featureContent', theLoginView);
      },



      contact: function () {
        console.log('in contact() of router.js');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        this.check_authentication_set_links();

        if (!this.theContactView) {
          this.theContactView = new ContactView();
        }
        this.show_view('#featureContent', this.theContactView);
      },



      gig_guide: function () {
        console.log('in gigGuide() of router.js');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        this.check_authentication_set_links();

        /*
        if (!this.defaultLandingView) {
          this.defaultLandingView = new GigGuideLandingView();
        }
        $('#featureContent').html(this.defaultLandingView.render().el);
        //console.log('this.defaultLandingView is ' + this.defaultLandingView);
        */

        //make sure we dont keep instantiating a collection everytime user
        //clicks on gigs tab in headerview
        if (!this.theGigList) {
          this.theGigList = new GigCollection();
        } 

        var self = this;
        this.theGigList.fetch({
          //reset: true, //replace all the models in the collection wite new ones
          success: function (collection, response) {
            console.log('self.theGigList.length = ' + self.theGigList.length);
            self.theGigsView = new GigsView({model: self.theGigList}); 
            self.show_view('#featureContent', self.theGigsView); 
            //self.showView('#featureList', self.theGigsView); 
            if (self.requestedId) {
              self.navigate('//gigs/' + self.requestedId);
      	      self.gigDetails(self.requestedId);
              self.requestedId = null;
            }
          },
          error: function (collection, response) {
            console.log('ERROR: in router.js and gigGuide handler');
          }
        });
      },



      gig_details: function (id) {
        console.log('in getDetails() of router.js, with id = ' + id);

        this.check_authentication_set_links();

        if(this.defaultLandingView) {
          console.log('gigDetails() of router.js and this.defaultLandingView is != null');
          this.defaultLandingView.close();
          this.defaultLandingView = null;
        }

        //set the currentView to null so we dont close down the gig list
        //doing this causes the gig list to not go away after user clicks a gig
        //and then navigates to another header view link. good or bad user experience??
        //pro: the app stays in a state to allow user access to gigs after they express
        //intent to find/select a gig.
        //con: memory leak if we dont close it properly when ui demands a completely 
        //clean slate i.e. if user goes onto purchase a ticket, clearing out the ui
        //would probably be a good thing.
        //*** also, make a reference to the gig list for future reference 
        //if we ever need to clean out the view
        //this.gigListReference = this.currentView;
        //then set the currentView to be null so showView() doesnt close the gig list.
        //this.currentView = null;


        if(this.theGigList) {
          this.gig = this.theGigList.get(id);

          //set a price instance variable which will be used if user proceeds with 
          //trying to purchase a gig
          this.selectedGigPrice = this.gig.get('price');

          //console.log('this.gig = ' + JSON.stringify(this.gig));
          this.show_view("#featureContent", new GigDetailView({model: this.gig}));
        } else {
          //must set an instance variable to hold the id of the gig currently
          //navigated to.
          //enables a 'bookmarking' of the current gig viewed for the user should
          //they click on another tab then back to the previously viewed gig guide item.
          this.requestedId = id;
          this.gigGuide();
        }
      },



      session: function (id) {
        console.log('USER AUTHENTICATED: in session() in router.js');
        console.log('USER AUTHENTICATED:id: ' + id 
          + ' in session() in router.js');

        if(!this.userDetailsView) {
          //instantiate a User Model
          this.userModel = new UserModel({_id: id});
          //userModel.set({_id: id});
          console.log('userModel id: ' + this.userModel.get("_id"));

          var self = this;

          //fetch data from server. the url used to get a user's data is made from
          //model's urlRoot entry: '/api/users/' + model._id
          //i.e. GET /api/users/model._id
          //=> only get user data back if user is authenticated.
          //otherwise, you get redirected to the login form.          
          this.userModel.fetch({
            success: function (model, response, options) {
              console.log('SUCCESS: in session handler. fetched user data from server.');
              console.dir(model);
              self.userDetailsView = new UserDetailsView({model: model});
              
              //vanity url & also to hide _id param in url from eyes. 
              //replace: true means update the url without creating an entry in
              //browser's history. yes/no???
              self.navigate('#/hello/' + model.get("first_name"), {replace:true});
              self.show_view('#featureContent', self.userDetailsView);

              //toggle login -> to -> logout in header view 
              self.switch_log_button('#logout_header','#login_header');              
              self.display_account_tab(true);
            },
            error: function (model, response, options) {
              console.log('ERROR: in session handler of router.js');
            }
          });
        }
      },



      logout: function () {
        console.log('in logout() route.');
        //HACL:this toggles the dropdown nav-collapse menu visibility for mobile devices
        this.is_bootstrap_btn_navbar_visible();

        if (this.order) {
          console.log('reset this.order to null, since you logged out.');

          //RESET THE ORDER: hard code the order reset after user logs out
          this.order = null; 
        }
        var self = this; 

        //logout user by destroying session.
        //=> make a DEL /api/users/logout http request
         $.ajax({
           url: '/api/users/logout',
           type: 'DELETE',
           success: function( data, textStatus, jqXHR ) {
             console.dir( data );
             console.log( 'Delete response:' );
             console.log( textStatus );
             console.dir( jqXHR );

             self.goodbye(data); 
           }
        });
        //toggle logout -> to -> login in header view 
        this.switch_log_button('#login_header', '#logout_header');
        this.display_account_tab(false);
      },



      goodbye: function (first_name) {
         if (!this.loggedOutView) {
           this.loggedOutView = new LoggedOutView();
         } 
         this.navigate('#/goodbye/' + first_name, {replace: true});
         this.show_view('#featureContent', this.loggedOutView);
      },
 


      delete_user_account: function (id) {
        console.log("and this.userModel.get('id'): " +  this.userModel.get('_id'));

        var self = this;

        //=> make a GET /api/users/session http request
        // to get the req.session object in order to get the user's _id
         $.ajax({
           url: '/api/users/session',
           type: 'GET',
           success: function(data, textStatus, jqXHR) {
  
             console.dir( data );
             console.log( 'Get response:' );
             console.log( textStatus );
             console.dir( jqXHR );
            
             //check (!) if user is legitimate before deleting their account. 
             if (data._id === id && 
                 data.authenticated === true &&
                 self.userModel &&
                 self.userModel.get('_id') === id
                ) 
             {
               console.log("in deleteUserAccount handler, " +
               "self.userModel is defined " + 
               "and self.userModel.get('id'): " +  self.userModel.get('_id') +
               "and self.userModel.get('id') === id (from url param) is true ");  

               self.userModel.destroy({
                 success: function (model, response) {
                   console.log('in success callback in self.userModel.destroy()');
                   console.dir(model);
                   console.log('in success callback,  response:');
                   console.dir(response);

                   //also log out the user
                   self.logout();
                 }, 
                 error: function (model, xhr) {
                   console.log('in error callback in self.userModel.destroy()');
                   console.dir(model);
                   console.log('in error callback,  response:');
                   console.dir(xhr);
                 }
               });

             } else {
               console.log('in deleteUserAccount handler and !this.userModel === true');
             }
           }
        });
      },


      //quick hack: query DOM to see if the nav-collapse div and the btn-navbar
      //elements are visible. if they are then we are viewing the app from a small screen
      //so setup the links in the navbar to _close_ the nav-collapse when clicked.
      //had to do this because by default the collapsed navbar _wont_ collapse after 
      //user clicks a link.
      is_bootstrap_btn_navbar_visible: function () {
        console.log('in is_bootstrap_btn_navbar_visible handler');

        //var display_attr = $('a.btn-navbar').css('display');
        var display_attr = $('button.navbar-toggle').css('display');
        console.log('button.navbar-toggle has css attribute display: ' + display_attr);
       
        if (display_attr === 'block'){
          console.log('btn-navbar is displayed on page');
          
          this.is_bootstrap_nav_collapse_visible();
        } 

        if (display_attr === 'none') {
          console.log('btn-navbar is NOT displayed on page');
        }


      },

      is_bootstrap_nav_collapse_visible: function () {
        console.log('in is_bootstrap_nav_collapse_visible handler');

        var display_attr = $('div.navbar-collapse.in').css('display');

        console.log('div.navbar-collapse.in has css attribute display: ' 
          + display_attr);
       
        //link div thing is NOT showing
        if (display_attr === 'none') {
          console.log('div.navbar-collapse.in has display:none on page');
        }

        //link div thing is showing
        if (display_attr === 'block') {
          console.log('div.navbar-collapse.in has block: ' + display_attr);
          //console.log('does the .navbar-collapse have \'in\' class: ' + 
          //  $('div.navbar-collapse').hasClass('in'));
          
          //hide the collapsed navigation links by 
          //1) deleting the 'in' word in class attribute 
          //2) adding back the collapsed class to <button>

          $('div.navbar-collapse.in').removeClass('in')

          //and also you must remove the 'collapsed' class for the <button> btn-navbar
          $('button.navbar-toggle').addClass('collapsed');
          
        }

      },



      switch_log_button: function (elementToShow, elementToHide) {
        $(elementToHide).css('display', 'none');
        $(elementToShow).css('display', 'block');
      },

      display_account_tab: function (logic) {
        if (logic) {
          $('#account').css('display', 'block');
        } else {
          $('#account').css('display', 'none');
        } 
      },

      show_view: function (selector, view) {
        console.log('in showView()');
        console.log('in showView(), this.currentView: ');
        console.log(this.currentView);
        if (this.currentView) {
          this.currentView.close();
        }
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
      }
    });
    return AppRouter;
  }
);
