//site/js/app.js


require.config({

  //baseUrl: "app",

  paths: {
    //'jquery':             'lib/jquery-1.9.1',
    'jquery':             'lib/jquery-1.10.2.min',
    'underscore':         'lib/underscore',
    'backbone':           'lib/backbone',
    'bootstrap':          'lib/bootstrap.min',
    'text':               'lib/text',
    'jquery-dateFormat':  'lib/jquery-dateFormat-1.0',
    'bootstrap-collapse': 'lib/bootstrap-collapse',
    'router':             'routers/router',
    'braintree':          'lib/braintree'
  },
  
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': ['jquery'],
    'jquery-dateFormat': ['jquery'],
    'bootstrap-collapse': ['jquery']
  }
});


require([
    'backbone',
    'views/gigs-view',
    'views/banner-view',
    'views/header-view',
    'router',
    'jquery-dateFormat',
    'bootstrap-collapse'
], function (Backbone, GigsView, BannerView, HeaderView, Router) {
     $(function () {

       //add a generic close() method to the Backbone View prototype.
       Backbone.View.prototype.close = function () {
         console.log('CLOSE VIEW: in app.js and Backbone.View.prototype.close');
         if (this.beforeClose) {
           this.beforeClose();
         }

         //removes the view from the DOM and calls stopListening to remove
         //any bound events that the view has listenTo'd
         this.remove();


         this.unbind();
       };
      
       console.log('in app.js and $(document).ready(handler) handler');
 
       var theHeader = new HeaderView();
       var theBanner = new BannerView();
       var theRouter = new Router();

       Backbone.history.start();
     });
   }
);
