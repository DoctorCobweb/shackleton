({
  appDir: '../',
  baseUrl: 'js',
  dir: '../../site-prod',
  //mainConfigFile: './app.js',
  mainConfigFile: './require_config.js', //moved require config into its own file
  paths: {
    'underscore': 'lib/underscore',
    'jquery-1.10.2.min': 'lib/jquery-1.10.2.min',
    'backbone' : 'lib/backbone',
    'text' : 'lib/text',
    'braintree': 'lib/braintree',
    'jquery-dateFormat-1.0': 'lib/jquery-dateFormat-1.0',
    'bootstrap-collapse' : 'lib/bootstrap-collapse'
  },
  modules: [
    {
      name: 'app' //optimize the 'app' module, path is /site-build/js/app.js
    }
  ]
})
