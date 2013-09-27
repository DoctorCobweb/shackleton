
require.config({

  //baseUrl: "js/lib",

  paths: {
    //'jquery':             'lib/jquery-1.9.1',
    'jquery':             'lib/jquery-1.10.2.min',
    'underscore':         'lib/underscore',
    'backbone':           'lib/backbone',
    'bootstrap':          'lib/bootstrap.min',
    'text':               'lib/text',
    'jquery-dateFormat':  'lib/jquery-dateFormat-1.0',
    'bootstrap-collapse': 'lib/bootstrap-collapse',
    'braintree':          'lib/braintree'
  },

  //paths: {
    //'views':       '../views',
    //'models':      '../models',
    //'collections': '../collections',
    //'routers':     '../routers',
    //'tpl':         '../tpl',
  //},

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
