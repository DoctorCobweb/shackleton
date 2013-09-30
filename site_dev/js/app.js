//site/js/app.js

//IMPORTANT: uncomment the require.config() here when wanting to use r.js optimized 
//version of the app. this is because there is a separate require.config() setup in a file
//called require_config.js (in the same dir as this file)

//require.config() here:
//for production: comment it out
//for development: uncomment it

//moved require config stuff off into its own file: require_config.js
//in app.build.js the mainConfigFile will path to this file now.

/*
require.config({

  baseUrl: "js/lib",

  //paths: {
      //'jquery':             'jquery-1.9.1',
    //'jquery':             'jquery-1.10.2.min',
    //'underscore':         'underscore',
    //'backbone':           'backbone',
    //'bootstrap':          'bootstrap.min',
    //'text':               'text',
    //'jquery-dateFormat':  'jquery-dateFormat-1.0',
    //'bootstrap-collapse': 'bootstrap-collapse',
    //'braintree':          'braintree'
  //},
 
  paths: {
    'views':       '../views',
    'models':      '../models',
    'collections': '../collections',
    'routers':     '../routers',
    'tpl':         '../tpl',
  },

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery-1.10.2.min'],
      exports: 'Backbone'
    },
    'bootstrap.min': ['jquery-1.10.2.min'],
    'jquery-dateFormat-1.0': ['jquery-1.10.2.min'],
    'bootstrap-collapse': ['jquery-1.10.2.min']
  }
});
*/




//start app

require([
    'backbone',
    'views/banner-view',
    'views/header-view',
    'routers/router',
    'jquery-dateFormat-1.0',
    'bootstrap-collapse'
], function (Backbone, BannerView, HeaderView, Router) {
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








//OLD: setup of require config and require function for app module. does NOT work.
/*
require.config({

  baseUrl: "js/lib",

  paths: {
    //'jquery':             'lib/jquery-1.9.1',
    //'jquery':             './jquery-1.10.2.min',
    //'underscore':         './underscore',
    //'backbone':           './backbone',
    //'bootstrap':          'bootstrap.min',
    //'text':               'text',
    //'jquery-dateFormat':  'jquery-dateFormat-1.0',
    //'bootstrap-collapse': 'bootstrap-collapse',
    //'braintree':          'braintree'
  },
 
  paths: {
    'views':       '../views',
    'models':      '../models',
    'collections': '../collections',
    'routers':     '../routers',
    'tpl':         '../tpl',
  },

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery-1.10.2.min'],
      exports: 'Backbone'
    },
    'bootstrap.min': ['jquery-1.10.2.min'],
    'jquery-dateFormat-1.0': ['jquery-1.10.2.min'],
    'bootstrap-collapse': ['jquery-1.10.2.min']
  }
});


require([
    'backbone',
    'views/banner-view',
    'views/header-view',
    'routers/router',
    'jquery-dateFormat-1.0',
    'bootstrap-collapse'
], function (Backbone, BannerView, HeaderView, Router) {
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

*/

